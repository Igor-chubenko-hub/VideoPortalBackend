module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Videos',
      [
        {
          title: 'first',
          owner: 1,
          description: 'my first video',
          videoLink:
            'http://mazwai.com/system/posts/videos/000/000/230/preview_mp4/travelpockets_iceland_land_of_fire_and_ice.mp4?1528191920',
          duration: '35',
          status: 'published',
        },
        {
          title: 'second',
          owner: 1,
          description: 'my first video',
          videoLink:
            'http://mazwai.com/system/posts/videos/000/000/229/preview_mp4_2/omote_iceland__an_iceland_venture.mp4?1528050680',
          duration: '35',
          status: 'published',
        },
        {
          title: 'third',
          owner: 1,
          description: 'my first video',
          videoLink:
            'http://mazwai.com/system/posts/videos/000/000/228/preview_mp4_3/journey_through_the_crimean_caves_eugene_bryohin.mp4?1510230678',
          duration: '35',
          status: 'published',
        },
        {
          title: 'title',
          owner: 1,
          description: 'my first video',
          videoLink:
            'http://mazwai.com/system/posts/videos/000/000/226/preview_mp4_2/the_sea_also_rises_FKY.mp4?1506949636',
          duration: '35',
          status: 'published',
        },
        {
          title: 'my title',
          owner: 1,
          description: 'my first video',
          videoLink:
            'http://mazwai.com/system/posts/videos/000/000/171/original/benjamin_wu--raccoon_come_and_go.mp4?1430615233',
          duration: '35',
          status: 'published',
        },
        {
          title: 'ooooo',
          owner: 1,
          description: 'my first video',
          videoLink:
            'http://mazwai.com/system/posts/videos/000/000/220/preview_mp4_3/the_valley-graham_uheslki.mp4?1460898850',
          duration: '35',
          status: 'published',
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Videos', null, {});
  },
};
