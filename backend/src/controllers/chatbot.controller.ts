import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';

// Simple intelligent chatbot response system
// In a production app, this would integrate with an LLM like OpenAI or Gemini
export const getChatResponse = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { message, context } = req.body;
        const user = req.user;

        // Context-aware logic based on user's current page
        let response = "";
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
            response = "Hello! I am your Hermeos Guide. How can I assist you with your property acquisitions today?";
        } else if (lowerMsg.includes("kyc") || lowerMsg.includes("verify")) {
            response = "To verify your account, please go to Settings > ID Verification. You'll need a government-issued ID (NIN, Passport, or Driver's License) and a proof of address.";
        } else if (lowerMsg.includes("withdraw") || lowerMsg.includes("wallet")) {
            response = "You can withdraw funds from your wallet to any registered Nigerian bank account. Go to Portfolio > Wallet and click 'Withdraw'. Processing takes 24-48 hours.";
        } else if (lowerMsg.includes("yield") || lowerMsg.includes("return")) {
            response = "Our properties typically offer a 10-15% annual rental yield, plus capital appreciation. You can track this in the Performance tab.";
        } else if (context === "marketplace") {
            response = "Currently, we have 4 high-yield assets available. The Lekki Axis Commercial Hub is 85% funded and offers strong returns.";
        } else if (lowerMsg.includes("buy") || lowerMsg.includes("acquire")) {
            response = "To acquire equity, browse the Marketplace, select a property, and click 'Acquire Equity'. You can start with as little as ₦500,000.";
        } else {
            response = "That's a great question. While I am an AI guide, for specific financial advice I recommend consulting with a certified advisor. Is there anything else about the platform I can help you with?";
        }

        // Simulate small delay for "intelligence" feel
        setTimeout(() => {
            res.status(200).json({
                success: true,
                data: {
                    reply: response,
                    suggestedActions: [
                        { label: "View Portfolio", link: "/portfolio" },
                        { label: "Check Properties", link: "/properties" }
                    ]
                }
            });
        }, 500);

    } catch (error) {
        next(error);
    }
};
