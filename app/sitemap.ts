import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eatlikeawolf.mx";
  const lastModified = new Date();

  const routes = [
    {
      path: "",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      path: "/calculadora",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/comida-real-cocinada-para-perros",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/mix-feeding-para-perros",
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      path: "/comida-para-perros-guadalajara",
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      path: "/comida-cocinada-para-perros-guadalajara",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/calculadora-comida-para-perros",
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      path: "/articulos",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/articulos/comida-humeda-vs-croquetas",
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      path: "/articulos/comida-casera-para-perros",
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      path: "/articulos/cuanta-comida-debe-comer-mi-perro",
      changeFrequency: "monthly",
      priority: 0.65,
    },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency:
      route.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: route.priority,
  }));
}
