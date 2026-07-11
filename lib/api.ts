const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'http://localhost:8080/api/v1/payment';

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  school?: string;
  city?: string;
  subject?: string;
  experience: string;
  workshopSpot?: string;
  amount?: number;
}

export interface PaymentOrderResponse {
  success: boolean;
  message: string;
  data?: {
    order_id: string;
    razorpay_order_id: string;
    amount: number;
    currency: string;
    key_id: string;
  };
  error?: string;
}

export interface PaymentVerificationData {
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
}

// Create payment order
export async function createPaymentOrder(data: RegistrationData): Promise<PaymentOrderResponse> {
  try {
    // Get workshop spot label for message
    const spotLabels: Record<string, string> = {
      'dexlabs': 'Dexlabs AI Skill Centre',
      'school': 'In School',
      'phoenix': 'Phoenix Palasios, PVR Inox Cinema'
    };
    
    const workshopSpotLabel = data.workshopSpot ? spotLabels[data.workshopSpot] || data.workshopSpot : 'Not selected';
    
    const response = await fetch(`${PAYMENT_API_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        grade: data.school || 'Not specified',
        experience: data.experience,
        interests: [],
        message: `School: ${data.school || 'N/A'}, City: ${data.city || 'N/A'}, Subject: ${data.subject || 'N/A'}, Workshop Spot: ${workshopSpotLabel}`,
        amount: data.amount || 200000, // Default ₹2000 in paise if not provided
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create payment order');
    }

    return result;
  } catch (error) {
    console.error('Create payment order error:', error);
    throw error;
  }
}

// Verify payment
export async function verifyPayment(data: PaymentVerificationData): Promise<PaymentVerificationResponse> {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Payment verification failed');
    }

    return result;
  } catch (error) {
    console.error('Verify payment error:', error);
    throw error;
  }
}

// Get payment status
export async function getPaymentStatus(orderId: string) {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/status/${orderId}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to get payment status');
    }

    return result;
  } catch (error) {
    console.error('Get payment status error:', error);
    throw error;
  }
}
