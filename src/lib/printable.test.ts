import { describe, expect, it } from "vitest";
import { markdownToPrintableHtml } from "./storage";

describe("markdownToPrintableHtml", () => {
  it("converte títulos em headings", () => {
    expect(markdownToPrintableHtml("# Sumário")).toBe("<h1>Sumário</h1>");
    expect(markdownToPrintableHtml("## Fase 1")).toBe("<h2>Fase 1</h2>");
    expect(markdownToPrintableHtml("### Detalhe")).toBe("<h3>Detalhe</h3>");
  });

  it("agrupa listas em ul/ol", () => {
    const html = markdownToPrintableHtml("- um\n- dois");
    expect(html).toBe("<ul>\n<li>um</li>\n<li>dois</li>\n</ul>");

    const ordered = markdownToPrintableHtml("1. primeiro\n2. segundo");
    expect(ordered).toBe("<ol>\n<li>primeiro</li>\n<li>segundo</li>\n</ol>");
  });

  it("aplica negrito, itálico e código inline", () => {
    expect(markdownToPrintableHtml("**forte**")).toContain("<strong>forte</strong>");
    expect(markdownToPrintableHtml("um *leve* ajuste")).toContain("<em>leve</em>");
    expect(markdownToPrintableHtml("use `npm test`")).toContain("<code>npm test</code>");
  });

  it("converte tabelas markdown", () => {
    const html = markdownToPrintableHtml("| Métrica | Meta |\n| --- | --- |\n| Lead time | -30% |");
    expect(html).toContain("<th>Métrica</th>");
    expect(html).toContain("<td>Lead time</td>");
    expect(html).toContain("</tbody></table>");
  });

  it("escapa HTML do conteúdo", () => {
    expect(markdownToPrintableHtml("<script>alert(1)</script>")).toContain("&lt;script&gt;");
  });

  it("nunca devolve documento vazio para markdown com conteúdo", () => {
    const plano = "## Plano\n\nTexto do parecer.\n\n- item\n";
    const html = markdownToPrintableHtml(plano);
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain("Texto do parecer.");
  });
});
