/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'doc',
      label: '介绍',
      id: 'intro',
    },
    {
      type: 'category',
      label: '快速开始',
      items: ['quick-start/install', 'quick-start/quick-start'],
      collapsed: true,
    },
    {
      type: 'category',
      label: '基础',
      items: [
        {
          type: 'category',
          label: '预备知识',
          items: ['basics/basic', 'basics/actor'],
        },
        'basics/world',
        'basics/room',
        'basics/camera',
        'basics/avatar',
        'basics/skin',
        'basics/path',
        'basics/config',
        'basics/richsurface',
        'basics/subsequence',
        'basics/timeline',
        'basics/event',
        'basics/rotation',
        'basics/joystick',
        'basics/keyboard',
        'basics/volume',
        'basics/broadcast',
        'basics/log',
        'basics/errorcode',
      ],
      collapsed: true,
    },
    {
      type: 'category',
      label: '进阶',
      items: [
        'advanced/preload',
        'advanced/stats',
        'advanced/migration',
        'advanced/fps-detector',
        'advanced/spatial-audio',
        'advanced/view-mode',
        'advanced/ai-chat',
      ],
    },
    {
      type: 'doc',
      label: 'CHANGELOG',
      id: 'changelog',
    },
  ],
}

module.exports = sidebars
