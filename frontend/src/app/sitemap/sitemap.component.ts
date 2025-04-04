import { Component, OnInit } from '@angular/core';
import { SitemapService } from '../services/sitemap.service';

@Component({
  selector: 'app-sitemap',
  template: `
    <h2>Sitemap</h2>
    <pre>{{ sitemapXml }}</pre>
    <button (click)="downloadSitemap()">Download Sitemap</button>
  `,
})
export class SitemapComponent implements OnInit {
  sitemapXml: string = '';

  constructor(private sitemapService: SitemapService) {}

  ngOnInit() {
    this.sitemapXml = this.sitemapService.generateSitemapXml();
  }

  downloadSitemap() {
    const blob = new Blob([this.sitemapXml], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'sitemap.xml';
    link.click();
  }
}
