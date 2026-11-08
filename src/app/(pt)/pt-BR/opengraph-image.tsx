import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";
import { getSocialPreviewMarkDataUrl } from "@/lib/social-preview-mark";

export const dynamic = "force-static";
export const alt = brand.socialPreview.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PortugueseOpenGraphImage() {
  const preview = brand.socialPreview;
  const markDataUrl = await getSocialPreviewMarkDataUrl(brand.mark);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: preview.background,
          color: preview.foreground,
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: preview.background,
            border: `4px solid ${preview.supporting}`,
            borderRadius: "32px",
            display: "flex",
            gap: "64px",
            height: "100%",
            justifyContent: "center",
            padding: "64px",
            width: "100%",
          }}
        >
          <img
            src={markDataUrl}
            alt={alt}
            width={220}
            height={220}
            style={{ objectFit: "contain" }}
          />
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "600px" }}>
            <div style={{ color: preview.accent, fontSize: 30, fontWeight: 700, letterSpacing: 5, marginBottom: 16 }}>
              {preview.eyebrow}
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>
              {preview.title}
            </div>
            <div style={{ color: preview.supporting, fontSize: 30, lineHeight: 1.3, marginTop: 24 }}>
              {preview.description}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
