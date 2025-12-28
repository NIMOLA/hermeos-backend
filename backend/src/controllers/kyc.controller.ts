import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Submit KYC verification
export const submitKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { idType, idNumber, bvn, nin } = req.body;
        const userId = req.user!.id;

        // Check if KYC already exists
        const existingKYC = await prisma.kYC.findUnique({
            where: { userId }
        });

        if (existingKYC && (existingKYC.status === 'PENDING' || existingKYC.status === 'APPROVED')) {
            return next(new AppError('KYC already submitted or approved', 400));
        }

        // Create or update KYC record
        const kyc = await prisma.kYC.upsert({
            where: { userId },
            update: {
                idType,
                idNumber,
                bvn,
                nin,
                status: 'PENDING',
                updatedAt: new Date()
            },
            create: {
                userId,
                idType,
                idNumber,
                bvn,
                nin,
                status: 'PENDING'
            }
        });

        // Update user's kycStatus
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

        const kyc = await prisma.kYC.update({
            where: { userId },
            data: {
                idDocumentUrl,
                proofOfAddressUrl
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
                data: { status: 'NOT_STARTED' }
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
