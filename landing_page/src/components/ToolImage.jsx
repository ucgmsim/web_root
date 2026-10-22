import Box from "@mui/material/Box";

/**
 * Responsive 16:9 tool preview, served at 600 or 1200 px wide
 */
export default function ToolImage({ tool, sizes, loading = "lazy", sx }) {
  return (
    <Box
      component="img"
      src={`/tools/${tool.id}.webp`}
      srcSet={`/tools/${tool.id}_600.webp 600w, /tools/${tool.id}.webp 1200w`}
      sizes={sizes}
      alt=""
      width={1200}
      height={675}
      loading={loading}
      decoding="async"
      sx={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 400ms ease",
        ...sx,
      }}
    />
  );
}
