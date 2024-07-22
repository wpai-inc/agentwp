import { WriteToEditor } from '@/Services/WriteToEditor';

const object = [
  {
    name: 'core/columns',
    attributes: {},
    innerBlocks: [
      {
        name: 'core/column',
        attributes: {},
        innerBlocks: [
          {
            name: 'core/paragraph',
            attributes: {
              content:
                'Once upon a time in a small village, there was a lovable dog named Rover. Rover was known throughout the village for his playful nature and friendly demeanor. Every morning, Rover would greet the villagers with a wagging tail and a joyful bark.',
            },
            innerBlocks: [],
          },
          {
            name: 'core/paragraph',
            attributes: {
              content:
                'Rover loved to explore the village and its surroundings. He would often be seen chasing butterflies in the meadow, running through the woods, and playing fetch with the children. His adventures were the talk of the village, and everyone enjoyed hearing about Rover’s playful exploits.',
            },
            innerBlocks: [],
          },
        ],
      },
      {
        name: 'core/column',
        attributes: {},
        innerBlocks: [
          {
            name: 'core/paragraph',
            attributes: {
              content:
                "One day, while exploring the edge of the village, Rover discovered a small, hidden path. Curious as ever, he decided to follow it. The path led him to a beautiful, hidden garden filled with vibrant flowers and a sparkling stream. Rover was thrilled with his discovery and couldn't wait to show his new friends.",
            },
            innerBlocks: [],
          },
          {
            name: 'core/paragraph',
            attributes: {
              content:
                'Rover made the hidden garden his special place. He would often bring his favorite toys there and spend hours playing and relaxing in the tranquil setting. The villagers noticed Rover’s new routine and wondered what he had found, but Rover kept his secret, reveling in his private paradise.',
            },
            innerBlocks: [],
          },
        ],
      },
    ],
    status: 'updating_inner_blocks',
    clientId: '16e89d4d-19ef-449c-9dda-88794f2c730a',
    valid: true,
  },
];

const blocksString = JSON.stringify( object, null, 2 );

wp.domReady( () => {
  setTimeout( () => {
    const blocksArray = blocksString.split( '\n' );

    let newContent = '';
    blocksArray.forEach( ( block, index ) => {
      setTimeout( () => {
        newContent = newContent + block;
        addTheBlock( newContent );
      }, 10 * index );
    } );
  }, 2000 );
} );

let previousContent = [ {} ];

function addTheBlock( content: any ) {
  const newPreviousContent = WriteToEditor( content, previousContent );
  if ( newPreviousContent ) {
    previousContent = newPreviousContent;
  }
}
