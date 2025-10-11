import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, serviceType, estimatedSize, additionalInfo } = body;

    // Validate required fields
    if (!fullName || !email || !serviceType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
New Commission Request from Israel's Studio Website

Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service Type: ${serviceType}
Estimated Size: ${estimatedSize || 'Not specified'}

Additional Information:
${additionalInfo || 'None provided'}

---
This email was sent from the Israel's Studio commission form.
Timestamp: ${new Date().toISOString()}
    `.trim();

    // Send email using a simple mailto approach
    // This will open the user's default email client
    const mailtoLink = `mailto:ritnourisrael@gmail.com?subject=${encodeURIComponent('ISRAEL STUDIO CUSTOM REQUEST')}&body=${encodeURIComponent(emailContent)}`;
    
    // Log the commission request
    console.log("Commission Request:", {
      fullName,
      email,
      phone,
      serviceType,
      estimatedSize,
      additionalInfo,
      timestamp: new Date().toISOString(),
      mailtoLink
    });

    // For a production setup, you would use a proper email service
    // For now, we'll return the mailto link so the frontend can handle it
    return NextResponse.json({ 
      success: true, 
      mailtoLink,
      message: "Commission request logged successfully" 
    });
  } catch (error) {
    console.error("Commission form error:", error);
    return NextResponse.json(
      { error: "Failed to submit commission request" },
      { status: 500 }
    );
  }
}
