export interface LegalSection {
  title: string;
  content: string;
}

export const CONTACT_EMAIL = 'zeiler.niklas@outlook.de';

export const IMPRINT_SECTIONS: LegalSection[] = [
  {
    title: "Angaben gemäß § 5 TMG",
    content: "Niklas Zeiler\nNebeniusstraße 14\n60386 Frankfurt\nDeutschland",
  },
  {
    title: "Kontakt",
    content: "E-Mail: zeiler.niklas@outlook.de\nTelefon: 017663316764\nWebsite: niklas-zeiler.de",
  },
  {
    title: "Verantwortlich für den Inhalt",
    content: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:\nNiklas Zeiler\nNebeniusstraße 14 60386 Frankfurt",
  },
  {
    title: "Haftungsausschluss",
    content: "Haftung für Inhalte:\n\nDie Inhalte unserer App wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte in der App nach den allgemeinen Gesetzen verantwortlich.\n\nNach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
  },
  {
    title: "Haftung für Links",
    content: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.\n\nDie verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.",
  },
  {
    title: "Urheberrecht",
    content: "Die durch die Betreiber der App erstellten Inhalte und Werke in dieser App unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.\n\nDownloads und Kopien dieser App sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte in dieser App nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet.",
  },
  {
    title: "Streitschlichtung",
    content: "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:\nhttps://ec.europa.eu/consumers/odr\n\nWir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "1. Verantwortlicher",
    content: "Verantwortlich für die Datenverarbeitung ist:\n\nNiklas Zeiler\nNebeniusstraße 14 60386 Frankfurt\nzeiler.niklas@outlook.de",
  },
  {
    title: "2. Erhebung und Speicherung personenbezogener Daten",
    content: "Wir erheben und verarbeiten folgende personenbezogene Daten:\n\n• E-Mail-Adresse (bei Registrierung)\n• Benutzername (optional)\n• Wunschlistendaten (Wünsche, Beschreibungen, Links, Bilder)\n• Nutzungsdaten (Zeitpunkt der Nutzung, verwendete Funktionen)\n\nDie Datenverarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).",
  },
  {
    title: "3. Verwendung von Firebase",
    content: "Diese App nutzt Firebase-Dienste von Google:\n\n• Firebase Authentication (zur Benutzerverwaltung)\n• Cloud Firestore (zur Datenspeicherung)\n• Firebase Storage (zur Bildspeicherung)\n\nDaten werden auf Servern von Google innerhalb der EU gespeichert. Weitere Informationen finden Sie in der Datenschutzerklärung von Google:\nhttps://policies.google.com/privacy",
  },
  {
    title: "4. Weitergabe von Daten",
    content: "Ihre Daten werden nur weitergegeben, wenn:\n\n• Sie eine Wunschliste über einen Share-Link teilen\n• Dies gesetzlich vorgeschrieben ist\n• Sie ausdrücklich eingewilligt haben\n\nWir verkaufen Ihre Daten nicht an Dritte.",
  },
  {
    title: "5. Speicherdauer",
    content: "Ihre Daten werden gespeichert, solange:\n\n• Ihr Konto aktiv ist\n• Es zur Vertragserfüllung erforderlich ist\n• Gesetzliche Aufbewahrungspflichten bestehen\n\nSie können Ihr Konto jederzeit löschen.",
  },
  {
    title: "6. Ihre Rechte",
    content: "Sie haben folgende Rechte:\n\n• Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)\n• Berichtigung unrichtiger Daten (Art. 16 DSGVO)\n• Löschung Ihrer Daten (Art. 17 DSGVO)\n• Einschränkung der Verarbeitung (Art. 18 DSGVO)\n• Datenübertragbarkeit (Art. 20 DSGVO)\n• Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)\n• Widerruf Ihrer Einwilligung (Art. 7 Abs. 3 DSGVO)\n\nZur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter zeiler.niklas@outlook.de.",
  },
  {
    title: "7. Beschwerderecht",
    content: "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.",
  },
  {
    title: "8. Datensicherheit",
    content: "Wir verwenden technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen Manipulation, Verlust, Zerstörung und unbefugten Zugriff zu schützen.\n\nDazu gehören:\n• SSL/TLS-Verschlüsselung\n• Verschlüsselte Datenübertragung\n• Regelmäßige Sicherheitsupdates\n• Zugriffskontrollen",
  },
  {
    title: "9. Änderungen der Datenschutzerklärung",
    content: "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder bei Änderungen der App anzupassen. Die aktuelle Version finden Sie jederzeit in der App.",
  },
];
export const PRIVACY_UPDATED_AT = '13.10.2026';
