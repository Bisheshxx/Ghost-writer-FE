import z from "zod";

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message);

const optionalNzPhoneNumber = z
  .string()
  .trim()
  .max(30, "Phone number must be 30 characters or less")
  .refine((value) => !value || formatNzPhoneNumber(value) !== null, {
    message: "Phone number must be a valid New Zealand phone number",
  })
  .transform((value) => (value ? formatNzPhoneNumber(value) ?? value : ""));

const optionalHttpsUrl = (label: string) =>
  z
    .string()
    .trim()
    .refine((value) => !value || isHttpsUrl(value), {
      message: `${label} must be a valid https URL`,
    });

const optionalHostedUrl = (label: string, hostname: string) =>
  optionalHttpsUrl(label).refine(
    (value) => !value || isAllowedHostname(value, hostname),
    {
      message: `${label} must use ${hostname}`,
    },
  );

export const accountProfileSchema = z.object({
  firstName: optionalText(50, "First name must be 50 characters or less"),
  lastName: optionalText(50, "Last name must be 50 characters or less"),
  phoneNumber: optionalNzPhoneNumber,
  location: optionalText(100, "Location must be 100 characters or less"),
  linkedinUrl: optionalHostedUrl("LinkedIn URL", "linkedin.com"),
  githubUrl: optionalHostedUrl("GitHub URL", "github.com"),
  portfolioUrl: optionalHttpsUrl("Portfolio URL"),
});

function formatNzPhoneNumber(value: string) {
  const compactValue = value.replace(/[\s()-]/g, "");

  if (!/^\+?\d+$/.test(compactValue)) return null;

  const isInternational = compactValue.startsWith("+64");
  const localNumber = isInternational ? `0${compactValue.slice(3)}` : compactValue;

  if (!localNumber.startsWith("0")) return null;

  if (localNumber.startsWith("02")) {
    return formatNzMobileNumber(localNumber, isInternational);
  }

  return formatNzLandlineNumber(localNumber, isInternational);
}

function formatNzMobileNumber(localNumber: string, isInternational: boolean) {
  if (!/^02\d{7,9}$/.test(localNumber)) return null;

  const nationalPrefix = localNumber.slice(0, 3);
  const subscriber = localNumber.slice(3);
  const formattedSubscriber = formatSubscriberNumber(subscriber);

  if (!formattedSubscriber) return null;

  if (isInternational) {
    return `+64 ${nationalPrefix.slice(1)} ${formattedSubscriber}`;
  }

  return `${nationalPrefix} ${formattedSubscriber}`;
}

function formatNzLandlineNumber(localNumber: string, isInternational: boolean) {
  if (!/^0[34679]\d{7}$/.test(localNumber)) return null;

  const areaCode = localNumber.slice(0, 2);
  const subscriber = localNumber.slice(2);
  const formattedSubscriber = `${subscriber.slice(0, 3)} ${subscriber.slice(3)}`;

  if (isInternational) {
    return `+64 ${areaCode.slice(1)} ${formattedSubscriber}`;
  }

  return `${areaCode} ${formattedSubscriber}`;
}

function formatSubscriberNumber(subscriber: string) {
  if (subscriber.length === 7) {
    return `${subscriber.slice(0, 3)} ${subscriber.slice(3)}`;
  }

  if (subscriber.length === 8) {
    return `${subscriber.slice(0, 3)} ${subscriber.slice(3)}`;
  }

  if (subscriber.length === 9) {
    return `${subscriber.slice(0, 3)} ${subscriber.slice(3, 6)} ${subscriber.slice(6)}`;
  }

  return null;
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isAllowedHostname(value: string, hostname: string) {
  try {
    const url = new URL(value);
    return url.hostname === hostname || url.hostname.endsWith(`.${hostname}`);
  } catch {
    return false;
  }
}
