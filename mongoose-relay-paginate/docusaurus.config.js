// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Mongoose Relay Paginate",
  tagline: "Paginate your Mongoose queries Relay style",
  url: "https://johnsonjo4531.github.io",
  baseUrl: "/mongoose-relay-paginate/",
  onBrokenLinks: "throw",
  favicon: "img/logo.png",
  onBrokenMarkdownLinks: "warn",
  organizationName: "johnsonjo4531", // Usually your GitHub org/user name.
  projectName: "mongoose-relay-paginate", // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Mongoose Relay Paginate",
        logo: {
          src: "img/logo.png",
          alt: "mongoose relay paginate logo",
          height: 35,
          width: 35,
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Tutorial",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/johnsonjo4531/mongoose-relay-paginate",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://www.npmjs.com/package/mongoose-relay-paginate",
            label: "npm",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              // {
              //   label: 'Stack Overflow',
              //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              // },
              {
                label: "Discord",
                href: "https://discord.gg/kHzXnAsSEv",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/johnsonjo4531/mongoose-relay-paginate",
              },

              {
                href: "https://www.npmjs.com/package/mongoose-relay-paginate",
                label: "npm",
              },
            ],
          },
        ],
        copyright: `Copyright © 2022-${new Date().getFullYear()} johnsonjo4531. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
