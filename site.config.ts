import { defineSiteConfig } from "./src/config/site";

export const siteConfig = defineSiteConfig({
	author: "Samuel Cubillos Martinez",
	siteUrl: "https://samuel082122008.github.io",
	hero: {
		headline: "Portafolio y blog",
		subheadline:
			"Estudiante de Ingenieria de Sistemas en la Universidad El Bosque, Bogotá. Este sitio documenta mis proyectos y aprendizajes a lo largo del semestre.",
		profileImage: "/profile.svg",
		statusBadge: "Estudiante",
	},

	description:
		"Portafolio y blog de un estudiante de Ingenieria de Sistemas en Bogotá, Colombia.",
	keywords: [
		"desarrollo",
		"Angular",
		"Spring Boot",
		"Java",
		"portafolio",
		"estudiante",
	],

	affiliations: [
		{
			role: "Estudiante de Ingenieria de Sistemas",
			department: "",
			institution: "Universidad El Bosque",
			url: "https://www.uelbosque.edu.co",
		},
	],
	researchInterests: [
		"Desarrollo",
		"Angular",
		"Spring Boot",
		"Java",
	],
	socialLinks: [
		{
			label: "GitHub",
			href: "https://github.com/Samuel082122008",
			icon: "i-mdi:github",
		},
		{
			label: "Email",
			href: "mailto:samuelcubillosmar@gmail.com",
			icon: "i-mdi:email-outline",
		},
	],
	navLinks: [
		{ href: "/presentacion", label: "Presentación" },
		{ href: "/evidencias", label: "Evidencias" },
	],
	homeBlocks: {
		hero: { enabled: true },
		publications: { enabled: false },
		posts: { enabled: true },
	},
});

export default siteConfig;