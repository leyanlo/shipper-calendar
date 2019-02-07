module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Shipper Calendar`,
        short_name: `Shipper Calendar`,
        start_url: `/`,
        background_color: `#FFFFFF`,
        theme_color: `#276EF1`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`,
      },
    },
    `gatsby-plugin-offline`,
    'gatsby-plugin-styletron',
  ],
};
