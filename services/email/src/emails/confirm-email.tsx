import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
  Tailwind,
  Link,
  Img,
} from "@react-email/components";
import { Clock } from "lucide-react";
import { z } from "zod";
import { registerEmail } from "@/email-registry";
import tailwindConfig from "@/tailwind.config";

const type = "confirm-email";

const schema = z.object({
  name: z.string().nullable(),
  type: z.enum(["signup", "waitlist"]),
  confirmationLink: z.string().url(),
  expirationHours: z.number(),
});

export default function ConfirmEmail({
  name,
  type,
  confirmationLink,
  expirationHours = 24,
}: z.infer<typeof schema>) {
  return (
    <Html>
      <Head />
      <Preview>
        {type === "waitlist"
          ? "Confirm your email address for the Koru waitlist"
          : "Confirm your email address for Koru"}
      </Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="m-auto bg-[#0D0D0D] p-5 font-sans">
          <Container className="mx-auto w-full max-w-[600px] overflow-hidden rounded-lg border border-[#333333] bg-[#121212]">
            {/* Header */}
            <Section className="border-b border-[#333333] bg-black p-6">
              <Img
                src="https://koru.cash/logos/dark_flat.png"
                alt="Koru"
                width={100}
                height={100}
              />
            </Section>

            {/* Content */}
            <Section className="p-8">
              <Text className="m-0 mb-6 text-2xl font-bold leading-8 text-white">
                Verify your email
              </Text>
              <Text className="my-4 text-base leading-6 text-[#D1D1D1]">
                Hey
                {name && (
                  <span className="font-semibold text-white">{name}</span>
                )}
                ,
              </Text>
              <Text className="my-4 text-base leading-6 text-[#D1D1D1]">
                {type === "waitlist"
                  ? "Thanks for joining the Koru waitlist! Please confirm your email address so we can keep you updated."
                  : "Thanks for joining Koru! Please confirm your email address to finish setting up your account."}
              </Text>

              {/* CTA Button */}
              <Section className="my-8 text-center">
                <Button
                  href={confirmationLink}
                  className="inline-block rounded-md bg-[#6355FF] px-6 py-3 text-base font-semibold text-white no-underline"
                >
                  Verify My Email
                </Button>
              </Section>

              {/* Expiration notice */}
              <Section className="my-6 rounded-md border border-[#333333] bg-[#1A1A1A] p-4">
                <Row>
                  <Column className="w-6 pt-1 align-middle">
                    <Clock size={20} color="#FFD700" strokeWidth={3} />
                  </Column>
                  <Column className="align-middle">
                    <Text className="m-0 text-sm leading-5 text-[#FFD700]">
                      This verification link expires in{" "}
                      <span className="font-bold">{expirationHours} hours</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Text className="my-4 text-base leading-6 text-[#D1D1D1]">
                If you didn't sign up for{" "}
                {type === "waitlist" ? "the waitlist" : "an account"}, you can
                safely ignore this email.
              </Text>

              <Hr className="my-8 border-[#333333]" />

              {/* Fallback link */}
              <Text className="my-2 text-sm leading-5 text-[#AAAAAA]">
                If the button doesn't work, paste this URL into your browser:
              </Text>
              <Link
                href={confirmationLink}
                className="my-2 mb-6 break-all text-xs leading-5 text-[#6355FF]"
              >
                {confirmationLink}
              </Link>

              {/* Security note */}
              <Section className="mt-8 rounded-md border border-[#333333] bg-[#1A1A1A] p-4">
                <Text className="m-0 text-xs leading-5 text-[#999999]">
                  This is an automated message from Koru. Please do not reply to
                  this email. For security reasons, we'll never ask for your
                  password or personal information.
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="border-t border-[#333333] bg-black p-6 text-center">
              <Text className="m-0 text-xs leading-5 text-[#999999]">
                © {new Date().getFullYear()} Koru. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

registerEmail(type, schema, ConfirmEmail);
