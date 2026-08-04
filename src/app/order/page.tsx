'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Website Order Experience - Phase 05
// Guided, premium, step-by-step ordering flow

interface WebsiteType {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  delivery: string;
  icon: string;
}

interface Package {
  id: string;
  name: string;
  price: number;
  delivery: string;
  features: string[];
  popular?: boolean;
}

interface ExtraFeature {
  id: string;
  name: string;
  price: number;
  description: string;
}

const websiteTypes: WebsiteType[] = [
  { id: 'portfolio', title: 'Personal Portfolio', description: 'Beautiful showcase of your work and achievements', startingPrice: 8000, delivery: '5-7 days', icon: '👤' },
  { id: 'business', title: 'Business Website', description: 'Professional online presence for your company', startingPrice: 15000, delivery: '7-10 days', icon: '🏢' },
  { id: 'ecommerce', title: 'E-commerce', description: 'Sell products online with cart and payments', startingPrice: 25000, delivery: '10-14 days', icon: '🛒' },
  { id: 'education', title: 'School / College', description: 'Educational institution website with courses', startingPrice: 18000, delivery: '8-12 days', icon: '🎓' },
  { id: 'organization', title: 'Organization / NGO', description: 'Non-profit or community organization site', startingPrice: 12000, delivery: '6-9 days', icon: '🤝' },
  { id: 'custom', title: 'Custom Website', description: 'Fully custom solution tailored to your needs', startingPrice: 20000, delivery: 'Varies', icon: '✨' },
];

const packages: Package[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 8000,
    delivery: '5 days',
    features: ['Up to 5 pages', 'Responsive design', 'Contact form', 'Basic SEO', '1 revision'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 15000,
    delivery: '8 days',
    features: ['Up to 10 pages', 'Responsive design', 'Contact + Booking form', 'Advanced SEO', '3 revisions', 'Blog integration'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 25000,
    delivery: '12 days',
    features: ['Unlimited pages', 'Responsive design', 'Admin dashboard', 'Payment integration', 'Unlimited revisions', 'AI chatbot', 'Analytics'],
  },
];

const extraFeatures: ExtraFeature[] = [
  { id: 'admin', name: 'Admin Panel', price: 5000, description: 'Manage content easily' },
  { id: 'auth', name: 'User Authentication', price: 4000, description: 'Login & registration' },
  { id: 'blog', name: 'Blog System', price: 3500, description: 'Write & publish articles' },
  { id: 'payment', name: 'Payment Gateway', price: 6000, description: 'bKash / Card payments' },
  { id: 'ai', name: 'AI Integration', price: 7000, description: 'Chatbot or smart features' },
  { id: 'multilang', name: 'Multi-language', price: 3000, description: 'Bangla + English support' },
  { id: 'seo', name: 'Advanced SEO', price: 2500, description: 'Better search ranking' },
];

export default function WebsiteOrderExperience() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<WebsiteType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Calculate total price
  const calculateTotal = () => {
    let total = selectedPackage?.price || 0;
    selectedExtras.forEach(extraId => {
      const extra = extraFeatures.find(f => f.id === extraId);
      if (extra) total += extra.price;
    });
    return total;
  };

  const totalPrice = calculateTotal();
  const estimatedDelivery = selectedPackage?.delivery || '7-10 days';

  // Toggle extra feature
  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Navigation
  const goToStep = (step: number) => {
    if (step === 2 && !selectedType) return;
    if (step === 3 && !selectedPackage) return;
    if (step === 4 && selectedExtras.length === 0 && currentStep < 4) return;
    setCurrentStep(step);
  };

  // Submit order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !selectedPackage) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newOrderId = 'ORD-' + Date.now().toString().slice(-6);
    setOrderId(newOrderId);
    setOrderSubmitted(true);
    setIsSubmitting(false);
  };



  // Success Screen
  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center py-12 px-4">
        <Container size="md">
          <div className="max-w-lg mx-auto text-center">
            <div className="text-7xl mb-8">🎉</div>
            
            <h1 className="text-4xl font-semibold tracking-tight mb-4">Thank You!</h1>
            <p className="text-xl text-[var(--color-text-secondary)] mb-8">
              Your order has been received successfully.
            </p>

            <Card variant="elevated" className="p-8 mb-8 text-left">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[var(--color-text-tertiary)]">Order ID</div>
                  <div className="font-mono text-2xl font-semibold text-[var(--color-brand-primary)]">{orderId}</div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="font-medium mb-1">Website Type</div>
                  <div>{selectedType?.title}</div>
                </div>
                
                <div>
                  <div className="font-medium mb-1">Package</div>
                  <div>{selectedPackage?.name} — ৳{selectedPackage?.price}</div>
                </div>

                {selectedExtras.length > 0 && (
                  <div>
                    <div className="font-medium mb-1">Extra Features</div>
                    <div className="text-sm">{selectedExtras.length} selected</div>
                  </div>
                )}

                <div className="pt-4 border-t font-semibold text-xl flex justify-between">
                  <span>Total</span>
                  <span>৳{totalPrice}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                I will contact you within 24 hours to discuss the project details.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <Button size="lg">Back to Home</Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="outline" size="lg">Explore Portfolio</Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-[var(--color-bg)]/95 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="/portfolio" className="font-semibold flex items-center gap-2">
              ← Back to Portfolio
            </Link>
            <div className="text-sm text-[var(--color-text-tertiary)]">Website Order Experience</div>
          </div>
        </Container>
      </nav>

      <Container>
        {/* Progress Indicator */}
        <div className="pt-10 pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between text-sm mb-2">
              {[1, 2, 3, 4, 5].map(step => (
                <div 
                  key={step} 
                  className={`font-medium ${currentStep >= step ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-tertiary)]'}`}
                >
                  Step {step}
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-brand-primary)] transition-all duration-300" 
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* STEP 1: Choose Website Type */}
        {currentStep === 1 && (
          <div className="max-w-5xl mx-auto pb-20">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-semibold tracking-tight mb-4">What kind of website do you need?</h1>
              <p className="text-xl text-[var(--color-text-secondary)]">Choose the type that best fits your needs</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websiteTypes.map(type => (
                <Card 
                  key={type.id} 
                  variant="elevated" 
                  className={`p-6 cursor-pointer transition-all hover:-translate-y-0.5 ${selectedType?.id === type.id ? 'ring-2 ring-[var(--color-brand-primary)]' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <div className="font-semibold text-2xl mb-2">{type.title}</div>
                  <p className="text-[var(--color-text-secondary)] mb-5">{type.description}</p>
                  
                  <div className="flex items-baseline justify-between border-t pt-4">
                    <div>
                      <div className="text-xs text-[var(--color-text-tertiary)]">Starting from</div>
                      <div className="text-3xl font-semibold text-[var(--color-brand-primary)]">৳{type.startingPrice}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-[var(--color-text-tertiary)]">Delivery</div>
                      <div className="font-medium">{type.delivery}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedType && (
              <div className="text-center mt-10">
                <Button size="lg" onClick={() => goToStep(2)}>
                  Continue with {selectedType.title} →
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Choose Package */}
        {currentStep === 2 && selectedType && (
          <div className="max-w-5xl mx-auto pb-20">
            <div className="text-center mb-10">
              <div className="text-sm text-[var(--color-brand-primary)] mb-1">STEP 2 OF 5</div>
              <h2 className="text-4xl font-semibold tracking-tight">Choose your package</h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">All packages include responsive design and modern UI</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {packages.map(pkg => (
                <Card 
                  key={pkg.id} 
                  variant="elevated" 
                  className={`p-7 flex flex-col relative transition-all ${selectedPackage?.id === pkg.id ? 'ring-2 ring-[var(--color-brand-primary)]' : ''}`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 right-6 bg-[var(--color-brand-primary)] text-white text-xs px-4 py-1 rounded-full font-medium">
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    <div className="font-semibold text-3xl">{pkg.name}</div>
                    <div className="text-4xl font-semibold mt-3 text-[var(--color-brand-primary)]">৳{pkg.price}</div>
                    <div className="text-sm text-[var(--color-text-tertiary)] mt-1">Delivery: {pkg.delivery}</div>
                  </div>

                  <ul className="mt-8 space-y-3 text-sm flex-1">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex gap-3">✓ {feature}</li>
                    ))}
                  </ul>

                  <Button 
                    variant={selectedPackage?.id === pkg.id ? "primary" : "outline"} 
                    className="mt-8 w-full"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    {selectedPackage?.id === pkg.id ? "Selected" : "Select Package"}
                  </Button>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 justify-center mt-10">
              <Button variant="ghost" onClick={() => goToStep(1)}>← Back</Button>
              {selectedPackage && (
                <Button size="lg" onClick={() => goToStep(3)}>Continue →</Button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Extra Features */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto pb-20">
            <div className="text-center mb-10">
              <div className="text-sm text-[var(--color-brand-primary)] mb-1">STEP 3 OF 5</div>
              <h2 className="text-4xl font-semibold tracking-tight">Add optional features</h2>
              <p className="text-[var(--color-text-secondary)] mt-2">Select the features you need</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {extraFeatures.map(feature => {
                const isSelected = selectedExtras.includes(feature.id);
                return (
                  <div 
                    key={feature.id}
                    onClick={() => toggleExtra(feature.id)}
                    className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5' : 'border-[var(--color-border)] hover:border-[var(--color-neutral-300)]'}`}
                  >
                    <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white' : 'border-[var(--color-border)]'}`}>
                      {isSelected && '✓'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{feature.name}</div>
                        <div className="font-semibold text-[var(--color-brand-primary)]">+৳{feature.price}</div>
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)]">{feature.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center mt-12">
              <Button variant="ghost" onClick={() => goToStep(2)}>← Back</Button>
              <Button size="lg" onClick={() => goToStep(4)}>Continue to Contact →</Button>
            </div>
          </div>
        )}

        {/* STEP 4: Contact Information */}
        {currentStep === 4 && (
          <div className="max-w-xl mx-auto pb-20">
            <div className="text-center mb-10">
              <div className="text-sm text-[var(--color-brand-primary)] mb-1">STEP 4 OF 5</div>
              <h2 className="text-4xl font-semibold tracking-tight">Tell us about yourself</h2>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); goToStep(5); }} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Your full name" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
                  <Input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="you@example.com" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone Number *</label>
                  <Input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="+880 1XXXXXXXXX" 
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Business / Organization Name</label>
                <Input 
                  name="businessName" 
                  value={formData.businessName} 
                  onChange={handleInputChange} 
                  placeholder="Optional" 
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Project Details / Message</label>
                <Textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Tell us more about your project..." 
                  rows={5} 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="ghost" type="button" onClick={() => goToStep(3)}>← Back</Button>
                <Button type="submit" size="lg" className="flex-1">Review Order →</Button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="max-w-2xl mx-auto pb-20">
            <div className="text-center mb-10">
              <div className="text-sm text-[var(--color-brand-primary)] mb-1">FINAL STEP</div>
              <h2 className="text-4xl font-semibold tracking-tight">Review your order</h2>
            </div>

            <Card variant="elevated" className="p-8 mb-8">
              <div className="space-y-6 text-sm">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <div className="font-medium">Website Type</div>
                    <div className="text-[var(--color-text-secondary)]">{selectedType?.title}</div>
                  </div>
                  <div className="font-semibold text-lg">৳{selectedType?.startingPrice}</div>
                </div>

                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <div className="font-medium">Package</div>
                    <div className="text-[var(--color-text-secondary)]">{selectedPackage?.name}</div>
                  </div>
                  <div className="font-semibold text-lg">৳{selectedPackage?.price}</div>
                </div>

                {selectedExtras.length > 0 && (
                  <div className="border-b pb-4">
                    <div className="font-medium mb-3">Extra Features</div>
                    {selectedExtras.map(id => {
                      const extra = extraFeatures.find(f => f.id === id);
                      return extra && (
                        <div key={id} className="flex justify-between text-sm py-1">
                          <span>{extra.name}</span>
                          <span>+৳{extra.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 flex justify-between items-center text-xl font-semibold">
                  <span>Total Estimated Price</span>
                  <span className="text-[var(--color-brand-primary)]">৳{totalPrice}</span>
                </div>

                <div className="text-sm text-[var(--color-text-tertiary)]">
                  Estimated delivery: {estimatedDelivery}
                </div>
              </div>
            </Card>

            <form onSubmit={handleSubmitOrder}>
              <div className="flex gap-4">
                <Button variant="ghost" type="button" onClick={() => goToStep(4)}>← Back</Button>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="flex-1" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Container>

      {/* Floating Price Summary (for steps 2-5) */}
      {(currentStep >= 2 && currentStep < 5) && (
        <div className="fixed bottom-6 right-6 z-50 hidden md:block">
          <Card variant="elevated" className="p-5 w-72 shadow-xl">
            <div className="text-sm text-[var(--color-text-tertiary)] mb-1">Order Summary</div>
            <div className="font-semibold text-2xl mb-1">৳{totalPrice}</div>
            <div className="text-xs text-[var(--color-text-tertiary)]">{estimatedDelivery}</div>
          </Card>
        </div>
      )}
    </div>
  );
}
