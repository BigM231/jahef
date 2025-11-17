import { useState } from "react";
import { Heart, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { z } from "zod";

// Extend Window interface to include PaystackPop
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref?: string;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

const Donate = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");

  const presetAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  // Validation schema
  const donationSchema = z.object({
    email: z.string().email("Invalid email address").max(255, "Email too long"),
    amount: z.number().min(100, "Minimum donation is ₦100").positive("Amount must be positive"),
  });

  const handleDonation = (gateway: "paystack" | "flutterwave") => {
    const donationAmount = amount || customAmount;
    
    // Validate using zod schema
    const validation = donationSchema.safeParse({
      email,
      amount: parseFloat(donationAmount),
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    if (gateway === "paystack") {
      // Check if Paystack is loaded
      if (!window.PaystackPop) {
        toast({
          title: "Error",
          description: "Payment system is loading, please try again",
          variant: "destructive",
        });
        return;
      }

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_15df41e162cdb9921b92853aeb232d70b9822985',
        email: email,
        amount: parseFloat(donationAmount) * 100, // Convert to kobo
        currency: 'NGN',
        ref: 'JAHEF_' + Math.floor(Math.random() * 1000000000 + 1),
        onClose: function() {
          toast({
            title: "Payment Cancelled",
            description: "You closed the payment window",
          });
        },
        callback: function(response) {
          toast({
            title: "Payment Successful!",
            description: `Thank you for your donation. Reference: ${response.reference}`,
          });
          // Reset form
          setAmount("");
          setCustomAmount("");
          setEmail("");
        },
      });

      handler.openIframe();
    } else {
      toast({
        title: "Coming Soon",
        description: "Flutterwave payment will be available soon",
      });
    }
  };

  const impactExamples = [
    {
      amount: "₦5,000",
      impact: "Provides school materials for 5 children",
    },
    {
      amount: "₦10,000",
      impact: "Supplies deworming medication for 20 children",
    },
    {
      amount: "₦25,000",
      impact: "Supports a family in crisis with essential needs",
    },
    {
      amount: "₦50,000",
      impact: "Funds a complete school materials distribution event",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-4">
            Make a Difference Today
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Your generous donation helps us provide genuine support and care to
            children, women, and families in need across Lagos communities
          </p>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-2xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-card p-8 md:p-12">
                <h2 className="font-heading font-bold text-3xl text-center mb-8 text-primary">
                  Choose Your Donation Amount
                </h2>

                {/* Preset Amounts */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {presetAmounts.map((presetAmount) => (
                    <button
                      key={presetAmount}
                      onClick={() => {
                        setAmount(presetAmount.toString());
                        setCustomAmount("");
                      }}
                      className={`p-4 rounded-xl font-secondary font-bold text-lg transition-all ${
                        amount === presetAmount.toString()
                          ? "bg-gradient-hero text-white shadow-lg"
                          : "bg-white border-2 border-border hover:border-primary text-foreground"
                      }`}
                    >
                      ₦{presetAmount.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-8">
                  <label className="block font-secondary font-semibold text-lg mb-3">
                    Or Enter Custom Amount (₦)
                  </label>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount("");
                    }}
                    placeholder="Enter amount in Naira"
                    className="text-lg p-6 rounded-xl"
                    min="100"
                  />
                </div>

                {/* Email Input */}
                <div className="mb-8">
                  <label className="block font-secondary font-semibold text-lg mb-3">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="text-lg p-6 rounded-xl"
                    required
                  />
                </div>

                {/* Payment Gateways */}
                <div className="space-y-4">
                  <h3 className="font-secondary font-semibold text-lg mb-3 text-center">
                    Choose Payment Method
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      size="lg"
                      onClick={() => handleDonation("paystack")}
                      className="bg-primary hover:bg-primary/90 text-white font-secondary font-bold text-lg py-6 rounded-xl"
                    >
                      <Shield className="mr-2" size={20} />
                      Pay with Paystack
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleDonation("flutterwave")}
                      className="bg-secondary hover:bg-secondary/90 text-white font-secondary font-bold text-lg py-6 rounded-xl"
                    >
                      <Shield className="mr-2" size={20} />
                      Pay with Flutterwave
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center mt-6">
                  Your donation is secure and will be processed through trusted
                  payment gateways
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-center text-primary mb-12">
              Your Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {impactExamples.map((example, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg rounded-xl overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-heading font-bold text-xl text-primary mb-2">
                          {example.amount}
                        </div>
                        <p className="text-muted-foreground">
                          {example.impact}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
              Why Your Donation Matters
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              At JAHEF, we understand firsthand what it means to be in need
              because our founder has lived through those struggles. Every
              donation you make goes directly toward providing genuine support
              without strings attached.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your contribution helps us continue offering health education,
              school support, and community empowerment programs that transform
              lives and restore hope. Together, we're creating a community where
              everyone receives the compassion and support they deserve.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Donate;
