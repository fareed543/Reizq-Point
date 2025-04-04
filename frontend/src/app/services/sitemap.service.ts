import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SitemapService {
  constructor(private router: Router) {}

  getAllRoutes(routes: Route[] = this.router.config, basePath: string = ''): string[] {
    let paths: string[] = [];

    routes.forEach(route => {
      const fullPath = basePath + (route.path ? `/${route.path}` : '');
      
      if (route.children) {
        paths = paths.concat(this.getAllRoutes(route.children, fullPath));
      } else if (route.loadChildren) {
        // Lazy-loaded modules
        paths.push(fullPath + '/*');  // Placeholder for lazy-loaded modules
      } else {
        paths.push(fullPath || '/'); // Handle root path
      }
    });

    return paths;
  }

  generateSitemapXml(): string {
    const routes = this.getAllRoutes();
    const baseUrl = 'https://walletplus.in'; // Change this to your domain

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    routes.forEach(route => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    return xml;
  }
}
