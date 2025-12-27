import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, primaryColor } = await req.json();
    
    console.log('Generating logo with prompt:', prompt);
    console.log('Primary color:', primaryColor);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert SVG logo designer specializing in medical and healthcare logos. 
    Generate clean, professional SVG code for medical logos.
    
    CRITICAL RULES:
    1. Return ONLY valid SVG code, nothing else
    2. Use viewBox="0 0 100 100"
    3. Use the provided primary color: ${primaryColor}
    4. Keep the design simple, elegant and professional
    5. Suitable for medical/healthcare context
    6. Do not include any text, just the symbol/icon
    7. Use clean lines and minimalist style
    8. Do not wrap in markdown code blocks
    9. Start directly with <svg and end with </svg>`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create an SVG logo based on this description: ${prompt}. Use ${primaryColor} as the main color.` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required, please add funds to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    let svgContent = data.choices?.[0]?.message?.content || '';
    
    // Clean up the response - extract only the SVG
    svgContent = svgContent.trim();
    
    // Remove markdown code blocks if present
    if (svgContent.includes('```')) {
      const svgMatch = svgContent.match(/```(?:svg|xml)?\s*([\s\S]*?)```/);
      if (svgMatch) {
        svgContent = svgMatch[1].trim();
      }
    }
    
    // Ensure it starts with <svg
    const svgStartIndex = svgContent.indexOf('<svg');
    if (svgStartIndex !== -1) {
      svgContent = svgContent.substring(svgStartIndex);
    }
    
    // Ensure it ends with </svg>
    const svgEndIndex = svgContent.lastIndexOf('</svg>');
    if (svgEndIndex !== -1) {
      svgContent = svgContent.substring(0, svgEndIndex + 6);
    }
    
    console.log('Generated SVG logo successfully');

    return new Response(JSON.stringify({ svg: svgContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-logo function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
