import Stripe from "stripe";
import config from "../config";

const stripe = new Stripe(config.stripe.stripe_secret_key as string, {
  apiVersion: "2026-03-25.dahlia",
});

export default stripe;
