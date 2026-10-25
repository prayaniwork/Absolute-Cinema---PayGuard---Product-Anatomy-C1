/**
 * Dynamic Canvas & SVG Watermarking Engine
 * Renders tamper-evident, multi-layered diagonal watermark barriers
 * and handles anti-extraction protections.
 */

export interface WatermarkOptions {
  clientName: string;
  freelancerName: string;
  milestoneTitle: string;
  timestamp: string;
  isReleased?: boolean;
}

/**
 * Creates a watermarked image Data URL from an image source
 */
export async function applyWatermarkToImage(
  imageSrc: string,
  options: WatermarkOptions
): Promise<string> {
  if (options.isReleased) {
    return imageSrc; // No watermark on released assets
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 800;

      // 1. Draw base deliverable
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. Add subtle dark contrast overlay
      ctx.fillStyle = 'rgba(7, 9, 14, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Draw diagonal repeating security text
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((-28 * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      const diagonalStepY = 140;
      const diagonalStepX = 380;
      const watermarkText = 'ABSOLUTE CINEMA • PROTECTED PREVIEW';
      const subText = 'DO NOT DISTRIBUTE • PENDING FINAL RELEASE';

      for (let y = -canvas.height; y < canvas.height * 2; y += diagonalStepY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += diagonalStepX) {
          // Primary text
          ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 6;
          ctx.fillText(watermarkText, x, y);

          // Secondary text
          ctx.font = '600 13px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(0, 242, 254, 0.45)';
          ctx.fillText(subText, x + 20, y + 24);
        }
      }
      ctx.restore();

      // 4. Draw forensic header banner
      const bannerHeight = 44;
      ctx.fillStyle = 'rgba(11, 15, 26, 0.88)';
      ctx.fillRect(0, 0, canvas.width, bannerHeight);

      ctx.fillStyle = '#00F2FE';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('🔒 ABSOLUTE CINEMA CHOKE-POINT SECURITY ENFORCED', 24, 27);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      const metaText = `Client: ${options.clientName} | Milestone: ${options.milestoneTitle} | ${options.timestamp}`;
      const metaWidth = ctx.measureText(metaText).width;
      ctx.fillText(metaText, canvas.width - metaWidth - 24, 27);

      // 5. Draw forensic footer banner with IP warning
      ctx.fillStyle = 'rgba(11, 15, 26, 0.92)';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(
        '⚠️ UNLICENSED COPY: MORAL & COMMERCIAL COPYRIGHT REMAINS SOLELY WITH CREATOR UNTIL MILESTONE APPROVAL & SETTLEMENT',
        24,
        canvas.height - 15
      );

      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}

/**
 * Currency formatter
 */
export function formatCurrency(amount: number, currency: 'INR' | 'USD' = 'INR'): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates 55/45 Freelancer-Advantage Fee Split
 * PRD: 55/45 balance leaning toward freelancer
 * Freelancer cut: 3.5%
 * Client platform cut: 5.5%
 */
export function calculateSplit(milestoneAmount: number) {
  const clientFeePercentage = 5.5;
  const freelancerFeePercentage = 3.5;

  const clientFeeAmount = Math.round(milestoneAmount * (clientFeePercentage / 100));
  const freelancerFeeAmount = Math.round(milestoneAmount * (freelancerFeePercentage / 100));

  const clientTotalPaid = milestoneAmount + clientFeeAmount;
  const freelancerNetPayout = milestoneAmount - freelancerFeeAmount;

  // Comparison against Upwork/Fiverr 20% commission
  const fiverrCut = Math.round(milestoneAmount * 0.20);
  const freelancerSavings = fiverrCut - freelancerFeeAmount;

  return {
    milestoneAmount,
    clientFeePercentage,
    clientFeeAmount,
    freelancerFeePercentage,
    freelancerFeeAmount,
    clientTotalPaid,
    freelancerNetPayout,
    freelancerSavings,
    fiverrCut,
  };
}

/**
 * Generates sample high-res SVG mockup art to use as pristine realistic deliverables
 */
export function generateMockDeliverableArt(type: 'brand' | 'app' | 'backend' | 'dashboard'): string {
  if (type === 'brand') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="960" viewBox="0 0 1440 960" fill="none">
      <rect width="1440" height="960" fill="%23090B10"/>
      <circle cx="200" cy="180" r="280" fill="%2300F2FE" fill-opacity="0.12" filter="blur(90px)"/>
      <circle cx="1200" cy="780" r="320" fill="%237C3AED" fill-opacity="0.16" filter="blur(110px)"/>
      
      <!-- Brand Guide Header -->
      <rect x="80" y="80" width="1280" height="800" rx="24" fill="%23101524" stroke="%231E293B" stroke-width="2"/>
      
      <text x="140" y="160" fill="%2300F2FE" font-family="sans-serif" font-weight="800" font-size="28" letter-spacing="4">ABSOLUTE CINEMA</text>
      <text x="140" y="200" fill="%2394A3B8" font-family="sans-serif" font-size="16">BRAND IDENTITY SYSTEM &amp; DESIGN TOKENS • V2.1 FINAL</text>
      
      <!-- Color Palette Swatches -->
      <rect x="140" y="250" width="180" height="180" rx="16" fill="%2300F2FE"/>
      <text x="156" y="390" fill="%23090B10" font-family="sans-serif" font-weight="700" font-size="15">Electric Cyan</text>
      <text x="156" y="412" fill="%23090B10" font-family="monospace" font-size="13">%2300F2FE</text>
      
      <rect x="340" y="250" width="180" height="180" rx="16" fill="%2310B981"/>
      <text x="356" y="390" fill="%23090B10" font-family="sans-serif" font-weight="700" font-size="15">Trust Emerald</text>
      <text x="356" y="412" fill="%23090B10" font-family="monospace" font-size="13">%2310B981</text>
      
      <rect x="540" y="250" width="180" height="180" rx="16" fill="%237C3AED"/>
      <text x="556" y="390" fill="%23FFFFFF" font-family="sans-serif" font-weight="700" font-size="15">Cinema Violet</text>
      <text x="556" y="412" fill="%23FFFFFF" font-family="monospace" font-size="13">%237C3AED</text>
      
      <rect x="740" y="250" width="180" height="180" rx="16" fill="%23090B10" stroke="%23334155" stroke-width="2"/>
      <text x="756" y="390" fill="%23FFFFFF" font-family="sans-serif" font-weight="700" font-size="15">Deep Obsidian</text>
      <text x="756" y="412" fill="%2394A3B8" font-family="monospace" font-size="13">%23090B10</text>
      
      <!-- Typography & Logo showcase -->
      <rect x="140" y="480" width="580" height="340" rx="16" fill="%230D111A" stroke="%231E293B"/>
      <text x="180" y="540" fill="%2364748B" font-family="sans-serif" font-weight="600" font-size="13">PRIMARY LOGOMARK EXPLORATION</text>
      <circle cx="260" cy="660" r="54" fill="none" stroke="%2300F2FE" stroke-width="10"/>
      <polygon points="250,635 285,660 250,685" fill="%2300F2FE"/>
      <text x="350" y="660" fill="%23FFFFFF" font-family="sans-serif" font-weight="800" font-size="34">KINETIC</text>
      <text x="350" y="688" fill="%2300F2FE" font-family="sans-serif" font-weight="600" font-size="14" letter-spacing="3">STUDIOS GLOBAL</text>
      
      <!-- Component Spec Sheet -->
      <rect x="740" y="480" width="580" height="340" rx="16" fill="%230D111A" stroke="%231E293B"/>
      <text x="780" y="540" fill="%2364748B" font-family="sans-serif" font-weight="600" font-size="13">DESIGN TOKENS &amp; ICONOGRAPHY SPEC</text>
      <rect x="780" y="580" width="240" height="48" rx="8" fill="%2300F2FE"/>
      <text x="830" y="610" fill="%23090B10" font-family="sans-serif" font-weight="700" font-size="15">Primary CTA Button</text>
      
      <rect x="780" y="650" width="240" height="48" rx="8" fill="none" stroke="%2300F2FE" stroke-width="2"/>
      <text x="830" y="680" fill="%2300F2FE" font-family="sans-serif" font-weight="700" font-size="15">Secondary Outline</text>
      
      <text x="780" y="750" fill="%2394A3B8" font-family="monospace" font-size="12">Tokens: borderRadius: 12px; fontScale: 1.25; elevation: 4;</text>
    </svg>`;
  }

  // App UI Screen Mockup
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="960" viewBox="0 0 1440 960" fill="none">
    <rect width="1440" height="960" fill="%230B0F19"/>
    
    <!-- Mobile frames side by side -->
    <rect x="240" y="100" width="400" height="760" rx="44" fill="%23121829" stroke="%23334155" stroke-width="4"/>
    <rect x="260" y="125" width="360" height="710" rx="32" fill="%23090C15"/>
    <circle cx="440" cy="148" r="8" fill="%231E293B"/>
    <text x="300" y="210" fill="%23FFFFFF" font-family="sans-serif" font-weight="700" font-size="22">Client Overview</text>
    <rect x="300" y="240" width="280" height="110" rx="16" fill="%23182238"/>
    <text x="320" y="278" fill="%2394A3B8" font-family="sans-serif" font-size="13">Active Milestone Pool</text>
    <text x="320" y="320" fill="%2300F2FE" font-family="sans-serif" font-weight="800" font-size="28">₹1,85,000</text>
    
    <!-- Second Screen Mockup -->
    <rect x="800" y="100" width="400" height="760" rx="44" fill="%23121829" stroke="%23334155" stroke-width="4"/>
    <rect x="820" y="125" width="360" height="710" rx="32" fill="%23090C15"/>
    <circle cx="1000" cy="148" r="8" fill="%231E293B"/>
    <text x="860" y="210" fill="%23FFFFFF" font-family="sans-serif" font-weight="700" font-size="22">Escrow Release</text>
    <rect x="860" y="240" width="280" height="160" rx="16" fill="%230F2A28" stroke="%2310B981" stroke-width="2"/>
    <text x="880" y="280" fill="%2310B981" font-family="sans-serif" font-weight="700" font-size="16">✓ Deliverable Approved</text>
    <text x="880" y="310" fill="%2394A3B8" font-family="sans-serif" font-size="13">Milestone funds released.</text>
    <rect x="880" y="340" width="240" height="40" rx="8" fill="%2310B981"/>
    <text x="930" y="365" fill="%23090B10" font-family="sans-serif" font-weight="700" font-size="14">Download Master Asset</text>
  </svg>`;
}
