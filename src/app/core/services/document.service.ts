import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import {  Observable, of } from "rxjs"
import { environment } from "../../../enviroments/environment"
import  { Document } from "../../shared/models/document.model"
import  { PaginatedResponse } from "../../shared/models/paginated-response.model"

@Injectable({
  providedIn: "root",
})
export class DocumentService {
  private apiUrl = environment.apiUrl

  // documentos para la prueba
  private mockDocuments: Document[] = [
    {
      id: 1,
      name: "Annual Report 2023",
      description: "Financial report for 2023",
      fileUrl: "assets/documents/report.pdf",
      createdAt: new Date("2023-12-15"),
      updatedAt: new Date("2023-12-15"),
      userId: 1,
      tenantId: 1,
      tags: ["financial", "annual"],
    },
    {
      id: 2,
      name: "Project Proposal",
      description: "New project proposal for Q1",
      fileUrl: "assets/documents/proposal.docx",
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-10"),
      userId: 2,
      tenantId: 1,
      tags: ["project", "proposal"],
    },
    {
      id: 3,
      name: "Marketing Strategy",
      description: "Marketing strategy for new product launch",
      fileUrl: "assets/documents/marketing.pptx",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      userId: 1,
      tenantId: 2,
      tags: ["marketing", "strategy"],
    },
  ]

  constructor(private http: HttpClient) {}

  getDocuments(
    tenantId: number,
    page = 0,
    limit = 10,
    search?: string,
    tags?: string[],
  ): Observable<PaginatedResponse<Document>> {
    // En una app real esto es una llamada a la api
    let filteredDocs = this.mockDocuments.filter((doc) => doc.tenantId === tenantId)

    if (search) {
      const searchLower = search.toLowerCase()
      filteredDocs = filteredDocs.filter(
        (doc) => doc.name.toLowerCase().includes(searchLower) || doc.description.toLowerCase().includes(searchLower),
      )
    }

    if (tags && tags.length > 0) {
      filteredDocs = filteredDocs.filter((doc) => tags.some((tag) => doc.tags.includes(tag)))
    }

    const paginatedDocs = filteredDocs.slice(page * limit, (page + 1) * limit)

    return of({
      items: paginatedDocs,
      total: filteredDocs.length,
      page,
      limit,
    })
  }

  getDocumentById(id: number, tenantId: number): Observable<Document> {
    // En una app real esto es una llamada a la api
    const document = this.mockDocuments.find((d) => d.id === id && d.tenantId === tenantId)
    if (!document) {
      throw new Error("Document not found")
    }
    return of(document)
  }

  createDocument(documentData: Partial<Document>): Observable<Document> {
    // En una app real esto es una llamada a la api
    const newDocument: Document = {
      id: this.mockDocuments.length + 1,
      name: documentData.name || "",
      description: documentData.description || "",
      fileUrl: documentData.fileUrl || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: documentData.userId || 0,
      tenantId: documentData.tenantId || 0,
      tags: documentData.tags || [],
    }
    this.mockDocuments.push(newDocument)
    return of(newDocument)
  }

  updateDocument(id: number, tenantId: number, documentData: Partial<Document>): Observable<Document> {
    // En una app real esto es una llamada a la api
    const index = this.mockDocuments.findIndex((d) => d.id === id && d.tenantId === tenantId)
    if (index !== -1) {
      this.mockDocuments[index] = {
        ...this.mockDocuments[index],
        ...documentData,
        updatedAt: new Date(),
      }
      return of(this.mockDocuments[index])
    }
    throw new Error("Documentos no encontrados")
  }

  deleteDocument(id: number, tenantId: number): Observable<boolean> {
    // En una app real esto es una llamada a la api
    const index = this.mockDocuments.findIndex((d) => d.id === id && d.tenantId === tenantId)
    if (index !== -1) {
      this.mockDocuments.splice(index, 1)
      return of(true)
    }
    return of(false)
  }

  uploadFile(file: File, tenantId: number): Observable<{ fileUrl: string }> {
    // En una app real esto hay que subirlo al servidor o a la nube
    // Para la demo lo damos como exitoso
    return of({ fileUrl: `assets/documents/${file.name}` })
  }
}