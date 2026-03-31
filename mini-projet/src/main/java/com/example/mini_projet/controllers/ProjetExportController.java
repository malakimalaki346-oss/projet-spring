package com.example.mini_projet.controllers;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.example.mini_projet.dto.response.ProjetResumeDTO;
import com.example.mini_projet.services.ProjetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/exports")
@Tag(name = "Export", description = "API pour exporter les données")
public class ProjetExportController {

    private final ProjetService projetService;

    public ProjetExportController(ProjetService projetService) {
        this.projetService = projetService;
    }

    @GetMapping("/projets/{id}/pdf")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Exporter un projet en PDF")
    public ResponseEntity<byte[]> exportProjetPDF(@PathVariable Long id) throws Exception {
        ProjetResumeDTO projet = projetService.getResume(id);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);

        Paragraph title = new Paragraph("Rapport du Projet", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Code: " + projet.code(), normalFont));
        document.add(new Paragraph("Nom: " + projet.nom(), normalFont));
        document.add(new Paragraph("Client: " + projet.organismeNom(), normalFont));
        document.add(new Paragraph("Montant Global: " + projet.montantGlobal() + " DH", normalFont));
        document.add(new Paragraph("Date Début: " + projet.dateDebut(), normalFont));
        document.add(new Paragraph("Date Fin: " + projet.dateFin(), normalFont));
        document.add(new Paragraph("Phases: " + projet.nombrePhases(), normalFont));
        document.add(new Paragraph("Phases Terminées: " + projet.phasesTerminees(), normalFont));
        document.add(new Paragraph("Montant Facturé: " + projet.montantFacture() + " DH", normalFont));
        document.add(new Paragraph("Montant Payé: " + projet.montantPaye() + " DH", normalFont));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell(new PdfPCell(new Phrase("Code", headerFont)));
        table.addCell(new PdfPCell(new Phrase("Libellé", headerFont)));
        table.addCell(new PdfPCell(new Phrase("Montant", headerFont)));
        table.addCell(new PdfPCell(new Phrase("État", headerFont)));

        for (var phase : projet.phases()) {
            table.addCell(new PdfPCell(new Phrase(phase.code(), normalFont)));
            table.addCell(new PdfPCell(new Phrase(phase.libelle(), normalFont)));
            table.addCell(new PdfPCell(new Phrase(phase.montant() + " DH", normalFont)));
            table.addCell(new PdfPCell(new Phrase(phase.etat(), normalFont)));
        }

        document.add(table);
        document.close();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "projet_" + id + ".pdf");

        return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
    }

    @GetMapping("/projets/excel")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'ADMIN')")
    @Operation(summary = "Exporter tous les projets en Excel")
    public ResponseEntity<byte[]> exportAllProjetsExcel() {
        var projets = projetService.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Projets");

            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Code", "Nom", "Client", "Montant", "Date Début", "Date Fin", "Phases", "Réalisation"};
            for (int i = 0; i < columns.length; i++) {
                headerRow.createCell(i).setCellValue(columns[i]);
            }

            int rowNum = 1;
            for (var projet : projets) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(projet.id());
                row.createCell(1).setCellValue(projet.code());
                row.createCell(2).setCellValue(projet.nom());
                row.createCell(3).setCellValue(projet.organismeNom());
                row.createCell(4).setCellValue(projet.montantGlobal());
                row.createCell(5).setCellValue(projet.dateDebut().toString());
                row.createCell(6).setCellValue(projet.dateFin().toString());
                row.createCell(7).setCellValue(projet.nombrePhases());
                row.createCell(8).setCellValue(projet.pourcentageRealisation() + "%");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "projets.xlsx");

            return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}