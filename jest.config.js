module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFilesAfterEnv: ['<rootDir>/src/plugins/vuetify.ts'],
  transformIgnorePatterns: ['/node_modules/(?!vuetify)']
  /* setupFiles: ['<rootDir>/src/plugins/vuetify.ts'], */
}
