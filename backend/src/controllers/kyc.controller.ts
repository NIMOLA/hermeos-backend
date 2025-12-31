import { Response, NextFunction } from 'express';
import { PrismaClient, KYCStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Submit KYC verification
export const submitKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // nin is not in schema, idNumber should cover it
        const { idType, idNumber, bvn } = req.body;
        const userId = req.user!.id;

        // Check if KYC already exists
        const existingKYC = await prisma.kYC.findUnique({
            where: { userId }
        });

        if (existingKYC && (existingKYC.status === KYCStatus.PENDING || existingKYC.status === KYCStatus.APPROVED)) {
            return next(new AppError('KYC already submitted or approved', 400));
        }

        // Create or update KYC record
        const kyc = await prisma.kYC.upsert({
            where: { userId },
            update: {
                idType,
                idNumber,
                bvn,
                status: KYCStatus.PENDING,
                updatedAt: new Date()
            },
            create: {
                userId,
                idType,
                idNumber,
                bvn,
                status: KYCStatus.PENDING
            }
        });

        // Update user's kycStatus using string 'PENDING' if user model still uses string? 
        // User model kycStatus is String? @default("not_submitted"). 
        // We really should use the enum there too, but let's stick to string for User model for now to avoid breaking other things
        await prisma.user.update({
            where: { id: userId },
            data: { kycStatus: 'PENDING' }
        });

        res.status(200).json({
            success: true,
            data: kyc,
            message: 'KYC submitted successfully for review'
        });
    } catch (error) {
        next(error);
    }
};

// Update KYC document URLs (normally called after file upload)
export const updateKYCDocuments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { idDocumentUrl, proofOfAddressUrl } = req.body;
        const userId = req.user!.id;

        // Schema uses idDocument and proofOfAddress
        const kyc = await prisma.kYC.update({
            where: { userId },
            data: {
                idDocument: idDocumentUrl,
                proofOfAddress: proofOfAddressUrl
            }
        });

        res.status(200).json({
            success: true,
            data: kyc,
            message: 'KYC documents updated'
        });
    } catch (error) {
        next(error);
    }
};

// Get current user's KYC status
export const getMyKYCStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const kyc = await prisma.kYC.findUnique({
            where: { userId: req.user!.id }
        });

        if (!kyc) {
            return res.status(200).json({
                success: true,
                data: { status: KYCStatus.NOT_SUBMITTED }
            });
        }

        res.status(200).json({
            success: true,
            data: kyc
        });
    } catch (error) {
        next(error);
    }
};
