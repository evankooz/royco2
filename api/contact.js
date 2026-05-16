export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { firstName, lastName, email, phone, company, subject, message } = req.body;

    if (!firstName || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Royco Distributors <onboarding@resend.dev>',
                to: email,
                reply_to: email,
                subject: `New inquiry: ${subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                    <p><strong>Topic:</strong> ${subject}</p>
                    <hr>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('Resend error:', err);
        return res.status(500).json({ error: 'Failed to send message' });
    }
}