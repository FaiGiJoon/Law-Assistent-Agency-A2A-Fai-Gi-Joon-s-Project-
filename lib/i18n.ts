import React from 'react';

export type Language = 'en' | 'nl';

const translations = {
  en: {
    headerTitle: "Dutch Law AI",
    headerSubtitle: "Assistant",
    bookAppointment: "Book an Appointment",
    
    footerDisclaimer: "This AI is for informational purposes only and does not constitute legal advice. Always consult with a qualified professional for legal matters.",

    welcomeTitle: "Dutch Law AI Assistant",
    welcomeMessage: "How can I assist you with Dutch law today? Type your question below or choose a starting point.",
    chatPlaceholder: "Ask a question about Dutch law...",

    suggestionsTitle: "Or start with a common topic:",
    suggestion1Title: "Car Accidents & Healthcare",
    suggestion1Prompt: "I'm an older person and I need information about my rights and the procedures to follow after a car accident in the Netherlands, especially concerning healthcare.",
    suggestion2Title: "Family Court for Parents",
    suggestion2Prompt: "I am a parent who needs to go to court for a child-related matter. What are the essential first steps and legal concepts I should understand about family court in the Netherlands?",

    headlinesTitle: "Trending Legal Topics in The Netherlands",
    headline1Title: "New Rental Laws in Amsterdam: What Tenants Need to Know",
    headline1Prompt: "Can you explain the new rental laws for the private sector that were recently implemented in Amsterdam?",
    headline2Title: "Rise in Online Scams: How to Protect Yourself Legally",
    headline2Prompt: "What are my legal options in the Netherlands if I become a victim of an online scam?",
    headline3Title: "Debate on 'Box 3' Wealth Tax Continues: What's the Latest?",
    headline3Prompt: "What is the current status of the 'Box 3' wealth tax in the Netherlands and what are the proposed changes?",

    modalTitle: "Book a Virtual Consultation",
    modalSubtitle: "Select a specialized agent for your needs.",
    agent1Name: "Car Accident & Healthcare Agent",
    agent1Desc: "Specializes in traffic law, insurance claims, and related healthcare rights.",
    agent2Name: "Family Court Agent",
    agent2Desc: "Specializes in child custody, divorce proceedings, and youth law.",
    confirmTitle: "Confirm Your Appointment",
    confirmNotice: "You are booking a virtual consultation. This is a simulated appointment for demonstration purposes.",
    backButton: "Back",
    confirmButton: "Confirm",
    successTitle: "Appointment Confirmed!",
    successMessage: "Your virtual consultation with the {agentName} has been successfully scheduled.",
    successNotice: "(This is a demonstration. No real appointment has been made.)",
    closeButton: "Close",
  },
  nl: {
    headerTitle: "Nederlands Recht AI",
    headerSubtitle: "Assistent",
    bookAppointment: "Afspraak Maken",

    footerDisclaimer: "Deze AI is uitsluitend voor informatieve doeleinden en vormt geen juridisch advies. Raadpleeg altijd een gekwalificeerde professional voor juridische zaken.",
    
    welcomeTitle: "Nederlands Recht AI Assistent",
    welcomeMessage: "Hoe kan ik u vandaag helpen met het Nederlands recht? Typ hieronder uw vraag of kies een startpunt.",
    chatPlaceholder: "Stel een vraag over het Nederlands recht...",

    suggestionsTitle: "Of begin met een veelvoorkomend onderwerp:",
    suggestion1Title: "Auto-ongevallen & Gezondheidszorg",
    suggestion1Prompt: "Ik ben een ouder persoon en heb informatie nodig over mijn rechten en de te volgen procedures na een auto-ongeluk in Nederland, met name met betrekking tot de gezondheidszorg.",
    suggestion2Title: "Familierechtbank voor Ouders",
    suggestion2Prompt: "Ik ben een ouder die voor een kindergerelateerde kwestie naar de rechtbank moet. Wat zijn de essentiële eerste stappen en juridische concepten die ik moet begrijpen over de familierechtbank in Nederland?",

    headlinesTitle: "Trending Juridische Onderwerpen in Nederland",
    headline1Title: "Nieuwe Huurwetten in Amsterdam: Wat Huurders Moeten Weten",
    headline1Prompt: "Kunt u de nieuwe huurwetten voor de particuliere sector die onlangs in Amsterdam zijn ingevoerd, uitleggen?",
    headline2Title: "Toename van Online Oplichting: Hoe U Zichzelf Juridisch Kunt Beschermen",
    headline2Prompt: "Wat zijn mijn juridische mogelijkheden in Nederland als ik het slachtoffer word van online oplichting?",
    headline3Title: "Debat over 'Box 3' Vermogensbelasting Gaat Door: Wat is de Laatste Stand van Zaken?",
    headline3Prompt: "Wat is de huidige status van de 'Box 3' vermogensbelasting in Nederland en wat zijn de voorgestelde wijzigingen?",

    modalTitle: "Boek een Virtueel Consult",
    modalSubtitle: "Selecteer een gespecialiseerde agent voor uw behoeften.",
    agent1Name: "Agent Verkeersongevallen & Zorg",
    agent1Desc: "Gespecialiseerd in verkeersrecht, verzekeringsclaims en gerelateerde zorgrechten.",
    agent2Name: "Agent Familierecht",
    agent2Desc: "Gespecialiseerd in voogdij, echtscheidingen en jeugdrecht.",
    confirmTitle: "Bevestig uw Afspraak",
    confirmNotice: "U boekt een virtueel consult. Dit is een gesimuleerde afspraak voor demonstratiedoeleinden.",
    backButton: "Terug",
    confirmButton: "Bevestig",
    successTitle: "Afspraak Bevestigd!",
    successMessage: "Uw virtuele consult met de {agentName} is succesvol ingepland.",
    successNotice: "(Dit is een demonstratie. Er is geen echte afspraak gemaakt.)",
    closeButton: "Sluiten",
  }
};

export const useTranslations = (lang: Language) => {
  return translations[lang];
};