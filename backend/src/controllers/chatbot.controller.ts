import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// --- TYPES ---
type IntentCategory = 'PORTFOLIO' | 'SEARCH' | 'INVEST' | 'KYC' | 'SUPPORT' | 'GENERAL';

interface BotIntent {
    category: IntentCategory;
    confidence: number;
    action: string;
    entities: any;
}

// --- SERVICES ---

/**
 * Service: Get User Portfolio Summary
 */
const getPortfolioSummary = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ownerships: {
                include: { property: true }
            }
        }
    });

    if (!user) return "I couldn't find your portfolio details.";

    // Safely handle Prisma Decimal types
    const walletBalance = user.walletBalance ? Number(user.walletBalance.toString()) : 0;
    const ownershipCount = user.ownerships.length;

    // Calculate total assets value
    const assetsValue = user.ownerships.reduce((sum, own) => {
        const units = own.units ? Number(own.units.toString()) : 0;
        const price = own.property.pricePerUnit ? Number(own.property.pricePerUnit.toString()) : 0;
        return sum + (units * price);
    }, 0);

    const totalNetWorth = walletBalance + assetsValue;

    return `Here is your portfolio summary:\n\n` +
        `💰 **Total Net Worth:** ₦${totalNetWorth.toLocaleString()}\n` +
        `💳 **Wallet Balance:** ₦${walletBalance.toLocaleString()}\n` +
        `🏠 **Active Properties:** ${ownershipCount}\n` +
        `\nWould you like a breakdown of your assets?`;
};

/**
 * Service: Search Properties
 */
const searchProperties = async (query: string) => {
    // Extract keywords
    const lower = query.toLowerCase();
    const whereClause: any = { status: 'PUBLISHED' };

    if (lower.includes('lagos')) whereClause.state = { contains: 'Lagos', mode: 'insensitive' };
    if (lower.includes('abuja')) whereClause.state = { contains: 'Abuja', mode: 'insensitive' };

    // Simple property type match (keywords)
    if (lower.match(/duplex|apartment|bungalow/)) {
        // Assuming description or propertyType field
        whereClause.description = { contains: lower.match(/duplex|apartment|bungalow/)![0], mode: 'insensitive' };
    }

    const properties = await prisma.property.findMany({
        where: whereClause,
        take: 3,
        orderBy: { expectedReturn: 'desc' }
    });

    if (properties.length === 0) return "I couldn't find any properties matching your criteria right now. Try searching for 'properties in Lagos'.";

    let response = "Here are top available properties:\n\n";
    properties.forEach((p, i) => {
        response += `${i + 1}. **${p.name}**\n   📍 ${p.city}, ${p.state}\n   📈 ${Number(p.expectedReturn)}% ROI | ₦${Number(p.pricePerUnit).toLocaleString()}/unit\n\n`;
    });

    return response + "Type the property name to see more details.";
};

/**
 * Service: Investment Calculator
 * Pattern: "returns on 500000" or "invest 1m"
 */
const calculateInvestment = async (text: string) => {
    // Extract amount using simple regex for now (e.g. 500k, 1m not supported yet, just numbers)
    const numbers = text.match(/\d+/g);
    if (!numbers) return "I need an amount to calculate. Try saying 'calculate returns for 100000'.";

    const amount = parseInt(numbers.join('')); // Naive parsing
    const avgRoi = 15; // 15% placeholder average

    const annualReturn = amount * (avgRoi / 100);

    return `Potential Returns Calculation:\n` +
        `Based on our average market performance (${avgRoi}% APY):\n\n` +
        `💸 **Investment:** ₦${amount.toLocaleString()}\n` +
        `📈 **Est. Annual Return:** ₦${annualReturn.toLocaleString()}\n` +
        `\n*Note: Past performance does not guarantee future results.*`;
};

// --- INTENT ROUTER ---

const detectIntent = (text: string, context: string): BotIntent => {
    const lower = text.toLowerCase();

    // Context Boosting
    let score = {
        portfolio: 0,
        search: 0,
        invest: 0,
        kyc: 0,
        support: 0
    };

    if (context === 'Portfolio') score.portfolio += 2;
    if (context === 'Marketplace') score.search += 1;
    if (context === 'Verification') score.kyc += 2;

    // Keyword Matching
    if (lower.match(/balance|worth|assets|how much|my money|wallet/)) score.portfolio += 5;
    if (lower.match(/find|search|show|list|looking for|buy|invest in/)) score.search += 4;
    if (lower.match(/return|roi|profit|yield|calculate|math/)) score.invest += 5;
    if (lower.match(/kyc|verify|id|document|status|approved/)) score.kyc += 5;
    if (lower.match(/help|agent|human|error|fail|issue|ticket/)) score.support += 5;
    if (lower.match(/investing|start|how to/)) score.invest += 2;

    // Determine Winner
    const maxScore = Math.max(score.portfolio, score.search, score.invest, score.kyc, score.support);

    if (maxScore < 3) return { category: 'GENERAL', confidence: 0, action: 'chat', entities: {} };

    if (score.support === maxScore) return { category: 'SUPPORT', confidence: 1, action: 'create_ticket', entities: {} };
    if (score.portfolio === maxScore) return { category: 'PORTFOLIO', confidence: 1, action: 'summary', entities: {} };
    if (score.search === maxScore) return { category: 'SEARCH', confidence: 1, action: 'list', entities: {} };
    if (score.invest === maxScore) return { category: 'INVEST', confidence: 1, action: 'calculate', entities: {} };
    if (score.kyc === maxScore) return { category: 'KYC', confidence: 1, action: 'status', entities: {} };

    return { category: 'GENERAL', confidence: 0, action: 'chat', entities: {} };
};

// --- CONTROLLER ---

export const handleChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { message, context } = req.body;

        if (!message) return next(new AppError('Message is required', 400));
        if (message.length > 500) return next(new AppError('Message too long', 400));

        // 1. Detect Intent
        const intent = detectIntent(message, context || 'General');

        let response = "";
        let ticketAction = null;

        // 2. Execute Action
        switch (intent.category) {
            case 'PORTFOLIO':
                response = await getPortfolioSummary(userId);
                break;

            case 'SEARCH':
                response = await searchProperties(message);
                break;

            case 'INVEST':
                response = await calculateInvestment(message);
                break;

            case 'KYC':
                const user = await prisma.user.findUnique({ where: { id: userId } });
                response = `Current KYC Status: **${user?.kycStatus?.toUpperCase() || 'UNKNOWN'}**.\n\n` +
                    (user?.kycStatus === 'VERIFIED' ? "You are fully verified to invest!" : "Please complete your verification in Settings.");
                break;

            case 'SUPPORT':
                // Create Ticket Logic (Simplified from previous version)
                const newTicket = await prisma.supportTicket.create({
                    data: {
                        userId,
                        subject: `Chat Support: ${message.substring(0, 30)}...`,
                        message,
                        category: 'General',
                        status: 'open',
                        messages: { create: { sender: 'user', message } }
                    }
                });
                response = `I've opened a support ticket (#${newTicket.id.slice(0, 8)}) for you. A human agent will review this shortly.`;
                ticketAction = 'created';
                break;

            default:
                // General Conversation / Fallback
                if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                    response = "Hello! I am Hermeos Guide. I can help you check your portfolio, search for properties, or calculate investment returns. What do you need?";
                } else {
                    response = "I'm not sure I understood that. I can help with:\n" +
                        "- Checking your **Portfolio Balance**\n" +
                        "- **Searching** for properties (e.g., 'Find properties in Lagos')\n" +
                        "- Calculating **ROI**\n" +
                        "Or type 'Help' to contact support.";
                }
        }

        res.status(200).json({
            success: true,
            data: {
                reply: response,
                intent: intent.category,
                ticketAction
            }
        });

    } catch (error) {
        next(error);
    }
};

export const getBroadcasts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const broadcasts = await prisma.notification.findMany({
            where: {
                type: 'BROADCAST',
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: broadcasts });
    } catch (error) {
        next(error);
    }
};
