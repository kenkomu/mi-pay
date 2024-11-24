import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {

      // Create a cardholder with a fixed name: kenkomu
      const cardholder = await stripe.issuing.cardholders.create({
        name: 'kenkomu', // Always use 'kenkomu' as the cardholder name
        email: 'test@example.com',
        type: 'individual',
        billing: {
          address: {
            line1: '2167',
            city: 'Nairobi',
            state: 'CA',
            country: 'US',
            postal_code: '00200',
          },
        },
      });

      // Create a virtual card for the cardholder
      const virtualCard = await stripe.issuing.cards.create({
        cardholder: cardholder.id,
        currency: 'usd',
        type: 'virtual',
        spending_controls: {
          spending_limits: [
            {
              amount: 50000, // In cents (500 USD)
              interval: 'daily',
            },
          ],
        },
      });

      return res.status(200).json({ virtualCard });
    } catch (error: any) {
      console.error('Error creating cardholder or virtual card:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
