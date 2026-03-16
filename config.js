/**
 * Mortgage Agent Configuration File
 * 
 * Edit the values below to customize the website for a specific mortgage agent.
 * This acts as the data source for the personal information template.
 */

const agentConfig = {
    // Basic Information
    branding: {
        companyName: "CHOLAN MORTGAGES", // Appears in navbar
        accentColor: "#1B365D",          // Navy
        secondaryColor: "#8AA399",       // Sage
        warmColor: "#F4F1EE"             // Warm
    },
    
    agent: {
        name: "Cholan Mortgages",
        title: "Expert Mortgage Services",
        licenseNumber: "NMLS #123456",
        photoUrl: "assets/agent.png", 
        shortQuote: "Cholan Mortgages made buying our first home surprisingly easy. They took the time to answer all our frantic questions and got us a rate we didn't think was possible!",
        fullBio: `Personalized mortgage solutions designed to fit your unique life goals. From first-time buyers to refinancing experts, we navigate the complexity so you don't have to.`
    },

    contact: {
        phone: "(555) 123-4567",
        phoneLink: "5551234567", // For tel: links
        email: "hello@cholanmortgages.com",
        officeAddress: "Ottawa, ON",
        bookingWidgetUrl: "https://calendly.com/abinan-jeyachandran/30min", 
        bookingUrl: "#booking" // Adjusted to match new ID
    },

    social: {
        linkedin: "https://linkedin.com",
        instagram: "https://instagram.com",
        facebook: "https://facebook.com"
    },
    
    // Feature Highlights (Why Choose Us)
    features: [
        {
            icon: "headset",
            title: "Fast Approval Process",
            description: "Our streamlined technology ensures you get pre-approved quickly, giving you a competitive edge in any market."
        },
        {
            icon: "lock-simple",
            title: "Transparent Communication",
            description: "No hidden fees or surprises. We explain every detail in plain English throughout the entire process."
        },
        {
            icon: "map-pin",
            title: "Local Market Experts",
            description: "We live and work in your community. We understand the local housing landscape better than big bank apps."
        }
    ],

    // Services Offered
    services: [
        {
            id: "purchase",
            title: "Home Purchase",
            description: "Buying your first home or moving up? We find the best rates and terms to make your dream home a reality.",
            details: ["First-time Homebuyer Programs", "Conventional & FHA Loans"],
            icon: "house"
        },
        {
            id: "refinance",
            title: "Refinancing",
            description: "Lower your monthly payments or tap into your home's equity. We analyze your situation to ensure it's the right move.",
            details: ["Rate & Term Refinance", "Cash-Out Equity Access"],
            icon: "currency-dollar"
        }
    ]
};
