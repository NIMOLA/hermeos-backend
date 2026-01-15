import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Master Terms and Conditions of Service</h1>
                    <p className="text-sm text-slate-500 mb-6">Effective Date: January 14, 2026</p>

                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.1 Parties to This Agreement</h2>
                        <p>THIS AGREEMENT constitutes a binding legal contract between:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>THE ISSUER:</strong> MANYMILES COOPERATIVE MULTIPURPOSE SOCIETY (Registered under the Cooperative Societies Law of Lagos State), being the legal owner of the assets and the entity responsible for the distribution of Surplus (hereinafter referred to as "The Society").</li>
                            <li><strong>THE PLATFORM MANAGER:</strong> MANYMILES CONSOLIDATED ELITE SERVICES (trading as HERMEOS PROPTECH), acting as the exclusive technical partner, data processor, and portfolio manager for the Issuer (hereinafter referred to as "The Platform").</li>
                            <li><strong>THE SUBSCRIBER:</strong> The individual user (hereinafter referred to as "THE CO-OPERATOR" or "THE MEMBER").</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.2 Preamble</h2>
                        <p><strong>WHEREAS:</strong></p>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>The Society holds the beneficial interest in the real estate assets designated as the "Iré Portfolio".</li>
                            <li>The Platform provides the digital infrastructure to manage subscriptions, allocate slots, and process payments on behalf of the Society.</li>
                            <li>The Co-operator desires to contribute to the Society’s activities by acquiring slots in the Iré Portfolio and agrees to be bound by the Bye-Laws of the Society.</li>
                        </ol>
                        <p className="mt-2"><strong>NOW, THEREFORE, IT IS AGREED AS FOLLOWS:</strong></p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.3 Definitions</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>"Slot":</strong> A specific unit of contribution towards the acquisition and development of the Iré Portfolio.</li>
                            <li><strong>"Contribution":</strong> The capital sum paid by the Co-operator to acquire Slots.</li>
                            <li><strong>"Surplus":</strong> The net excess realized from the rental income, lease, or sale of the Portfolio assets after expenses.</li>
                            <li><strong>"Patronage Refund":</strong> The portion of the Surplus distributed to the Co-operator, calculated in proportion to the number of Slots held.</li>
                            <li><strong>"Beneficial Interest":</strong> The right to enjoy the economic benefits of the asset, held in trust by the Society.</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.4 Membership and Eligibility</h2>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.4.1 Automatic Enrollment</h3>
                        <p>Participation in the Iré Portfolio is strictly limited to members of the Society. By executing a Contribution via the Platform, the Co-operator is automatically enrolled as a member (or provisional member) of Manymiles Cooperative Multipurpose Society.</p>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.4.2 Adherence to Bye-Laws</h3>
                        <p>The Co-operator agrees to abide by the registered Bye-Laws of the Society. The Co-operator’s rights are those of a member contributing to a cooperative project, not those of a shareholder in a public company.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.5 The Asset: Iré Portfolio</h2>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.5.1 Nature of Ownership</h3>
                        <p>The Co-operator acknowledges that the legal title to the land and properties within the Iré Portfolio is vested in the Society. The Co-operator holds a Beneficial Interest evidenced by a digital Slot Certificate.</p>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.5.2 Portfolio Strategy</h3>
                        <p>The Iré Portfolio focuses on high-value development in strategic locations (initially the Lekki-Ajah axis, Lagos). The Society reserves the right to make operational decisions regarding construction, tenancy, and maintenance to maximize the Surplus.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.6 Agency and Data Authorization</h2>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.6.1 Appointment of Agent</h3>
                        <p>The Co-operator hereby appoints Hermeos Proptech (The Platform) as their limited agent for the sole purpose of:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Collecting the Contribution.</li>
                            <li>Remitting said Contribution to the Society.</li>
                        </ul>
                        <p>Receipt of funds by the Platform constitutes a valid discharge of the Co-operator’s payment obligation to the Society.</p>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.6.2 Data Transfer Consent</h3>
                        <p>The Co-operator explicitly grants the Platform the right to transfer their personal data (Name, BVN, Address) to the Society for the purpose of perfecting membership in the Cooperative Register and conducting statutory AML/KYC checks.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.7 Financial Provisions</h2>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.7.1 Nature of Economic Benefits</h3>
                        <p>The Society shall not pay fixed interest or dividends in the commercial sense. Instead, payouts are classified as Patronage Refunds, derived strictly from the commercial performance of the Iré Portfolio. Refunds are declared periodically based on the realized Surplus.</p>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.7.2 Management Fees</h3>
                        <p>The Platform is entitled to a Management Fee of 5% deducted from the Gross Revenue of the portfolio to cover technology, staffing, and administrative costs before the declaration of Surplus.</p>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.7.3 No Guarantee of Surplus</h3>
                        <p>While the Society utilizes expert analysis to project outcomes, the Co-operator acknowledges that real estate markets fluctuate and past performance is not a guarantee of future Surplus.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.8 Liquidation and Withdrawal</h2>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.8.1 Lock-in Period</h3>
                        <p>Contributions are subject to a mandatory Lock-in Period of 12 Months from the date of issuance.</p>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.8.2 Withdrawal Procedure</h3>
                        <p>Upon expiration of the Lock-in Period, a Co-operator may request to liquidate their Slots by selling back to the Society (subject to available liquidity) or transferring to another member.</p>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.8.3 Notice Period</h3>
                        <p>All liquidation requests are subject to a 90-day processing period.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.9 Dispute Resolution</h2>
                        <h3 className="text-lg font-medium mt-4 mb-2">1.9.1 Statutory Arbitration</h3>
                        <p>In accordance with Section 50 of the Cooperative Societies Law of Lagos State, all disputes regarding membership, contributions, or refunds shall be referred to the Director of Cooperative Services, Lagos State Ministry of Commerce, Industry and Cooperatives for arbitration. The decision of the Director shall be final and binding. Litigation in court is prohibited in the first instance.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1.10 Governing Law</h2>
                        <p>This Agreement is governed by the laws of the Federal Republic of Nigeria, specifically the Cooperative Societies Law of Lagos State and the Nigeria Data Protection Act 2023.</p>

                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Link to="/" className="text-primary hover:text-primary-dark font-medium">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
