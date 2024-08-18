import { NextDataPathnameNormalizer } from "next/dist/server/future/normalizers/request/next-data"
import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});

const formatAmountForStripe = (amount, currency) => {
    return Math.round(amount * 100);
};

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const session_id = searchParams.get('session_id');

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.error('Error retrieving checkout session:', error);
        return NextResponse.json({ error: { message: error.message } }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { plan } = body;

        let unitAmount;
        let productName;

        if (plan === 'pro') {
            unitAmount = formatAmountForStripe(5, 'usd'); // $5.00 for pro
            productName = 'Pro subscription';
        } else if (plan === 'basic') {
            unitAmount = formatAmountForStripe(1, 'usd'); // $1.00 for basic
            productName = 'Basic subscription';
        } else {
            throw new Error('Invalid plan selected');
        }

        const params = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
                        },
                        unit_amount: unitAmount,
                        recurring: {
                            interval: 'month',
                            interval_count: 1,
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get('Referer')}result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('Referer')}result?session_id={CHECKOUT_SESSION_ID}`,
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);

        return NextResponse.json(checkoutSession, {
            status: 200,
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
            status: 500,
        });
    }
}
