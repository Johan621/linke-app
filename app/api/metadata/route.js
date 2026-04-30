import ogs from "open-graph-scraper";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL
    let validUrl = url;
    if (!validUrl.startsWith("http")) {
      validUrl = "https://" + validUrl;
    }

    try {
      new URL(validUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch metadata using open-graph-scraper
    const { result, error } = await ogs({
      url: validUrl,
      timeout: 8000,
      fetchOptions: {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; Linke/1.0; +https://linke.app)",
        },
      },
    });

    if (error) {
      // Fallback: return basic info from URL
      const domain = new URL(validUrl).hostname.replace("www.", "");
      return NextResponse.json({
        url: validUrl,
        title: domain,
        description: "",
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        preview: null,
        domain,
      });
    }

    const domain = new URL(validUrl).hostname.replace("www.", "");

    // Extract best available image
    let preview = null;
    if (result.ogImage && result.ogImage.length > 0) {
      preview = result.ogImage[0].url;
    } else if (result.twitterImage && result.twitterImage.length > 0) {
      preview = result.twitterImage[0].url;
    }

    // Extract favicon
    let favicon = result.favicon;
    if (favicon && !favicon.startsWith("http")) {
      favicon = new URL(favicon, validUrl).href;
    }
    if (!favicon) {
      favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    }

    return NextResponse.json({
      url: validUrl,
      title: result.ogTitle || result.dcTitle || result.twitterTitle || domain,
      description:
        result.ogDescription ||
        result.dcDescription ||
        result.twitterDescription ||
        "",
      favicon,
      preview,
      domain,
    });
  } catch (err) {
    console.error("Metadata fetch error:", err);
    // Ultimate fallback
    try {
      const domain = new URL(
        (await request.clone().json()).url
      ).hostname.replace("www.", "");
      return NextResponse.json({
        url: (await request.clone().json()).url,
        title: domain,
        description: "",
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        preview: null,
        domain,
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch metadata" },
        { status: 500 }
      );
    }
  }
}
