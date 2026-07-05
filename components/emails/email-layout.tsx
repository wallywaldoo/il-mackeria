import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { SITE } from "@/lib/constants";
import { emailBrand } from "@/lib/email/brand";

const { colors, fonts } = emailBrand;

interface EmailLayoutProps {
  preview: string;
  title: string;
  children: ReactNode;
  lang?: "sv" | "en";
}

export function EmailLayout({
  preview,
  title,
  children,
  lang = "sv",
}: EmailLayoutProps) {
  const logoUrl = `${SITE.url}/images/il-mackeria-logo.png`;

  return (
    <Html lang={lang}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Source+Sans+3:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          backgroundColor: colors.creamLight,
          fontFamily: fonts.body,
          color: colors.charcoal,
        }}
      >
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px" }}>
          <Section
            style={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.line}`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(30, 30, 30, 0.06)",
            }}
          >
            <Section style={{ height: 4, lineHeight: "4px", fontSize: 0 }}>
              <span
                style={{
                  display: "inline-block",
                  width: "33.33%",
                  height: 4,
                  backgroundColor: colors.flagGreen,
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "33.33%",
                  height: 4,
                  backgroundColor: colors.white,
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: "33.34%",
                  height: 4,
                  backgroundColor: colors.flagRed,
                }}
              />
            </Section>

            <Section style={{ padding: "32px 32px 0" }}>
              <Img
                src={logoUrl}
                alt="il mackeria"
                width={180}
                height="auto"
                style={{ display: "block", margin: "0 auto" }}
              />
              <Text
                style={{
                  margin: "8px 0 0",
                  textAlign: "center",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: colors.warmGray,
                }}
              >
                {SITE.tagline}
              </Text>

              <Heading
                style={{
                  margin: "24px 0 0",
                  textAlign: "center",
                  fontFamily: fonts.heading,
                  fontSize: 32,
                  fontWeight: 600,
                  lineHeight: "1.1",
                  color: colors.burgundy,
                }}
              >
                {title}
              </Heading>

              <Hr
                style={{
                  border: "none",
                  borderTop: `1px solid ${colors.line}`,
                  margin: "24px 0 0",
                }}
              />
            </Section>

            <Section style={{ padding: "24px 32px 32px" }}>{children}</Section>

            <Section
              style={{
                backgroundColor: colors.burgundyDark,
                padding: "20px 32px",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: 13,
                  lineHeight: "20px",
                  color: colors.cream,
                }}
              >
                <strong style={{ fontWeight: 600 }}>{SITE.name}</strong>
                <br />
                {SITE.address.street}, {SITE.address.city}
                <br />
                <Link
                  href={SITE.url}
                  style={{ color: colors.cream, textDecoration: "underline" }}
                >
                  {SITE.domain}
                </Link>
                {" · "}
                <Link
                  href={SITE.instagram}
                  style={{ color: colors.cream, textDecoration: "underline" }}
                >
                  @ilmackeria
                </Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

interface EmailFieldProps {
  label: string;
  value: ReactNode;
}

export function EmailField({ label, value }: EmailFieldProps) {
  return (
    <Section
      style={{
        marginBottom: 12,
        padding: "12px 14px",
        backgroundColor: colors.creamLight,
        border: `1px solid ${colors.line}`,
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          margin: "0 0 4px",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: colors.warmGray,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: "22px",
          color: colors.charcoal,
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </Text>
    </Section>
  );
}

export function EmailParagraph({ children }: { children: ReactNode }) {
  return (
    <Text
      style={{
        margin: "0 0 16px",
        fontSize: 15,
        lineHeight: "24px",
        color: colors.charcoal,
      }}
    >
      {children}
    </Text>
  );
}
