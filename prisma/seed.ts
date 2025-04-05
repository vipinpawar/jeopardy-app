import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.question.createMany({
//     data: [
//       {
//         name: "Backpack",
//         category: "Accessories",
//         basePrice: 2999,
//         imageUrl: "/images/backPack.webp"
//       },
//       {
//         name: "Bluetooth Speaker",
//         category: "Electronics",
//         basePrice: 4999,
//         imageUrl: "/images/bluetoothSpeaker.webp"
//       },
//       {
//         name: "Coffee Maker",
//         category: "Appliances",
//         basePrice: 3999,
//         imageUrl: "/images/coffeeMaker.webp"
//       },
//       {
//         name: "E-book Reader",
//         category: "Books",
//         basePrice: 9999,
//         imageUrl: "/images/E-book2.avif"
//       },
//       {
//         name: "Gaming Mouse",
//         category: "Electronics",
//         basePrice: 1499,
//         imageUrl: "/images/gamingMouse.webp"
//       },
//       {
//         name: "LED TV",
//         category: "Electronics",
//         basePrice: 25999,
//         imageUrl: "/images/LEDTV.webp"
//       },
//       {
//         name: "Office Chair",
//         category: "Furniture",
//         basePrice: 6999,
//         imageUrl: "/images/officeChair.webp"
//       },
//       {
//         name: "Running Shoes",
//         category: "Footwear",
//         basePrice: 3499,
//         imageUrl: "/images/runningShoes.webp"
//       },
//       {
//         name: "Smart Watch",
//         category: "Electronics",
//         basePrice: 7999,
//         imageUrl: "/images/smartWatch.webp"
//       },
//       {
//         name: "Stainless Bottle",
//         category: "Accessories",
//         basePrice: 999,
//         imageUrl: "/images/stainlessBottle.webp"
//       },
//       {
//         name: "Store Poster",
//         category: "Misc",
//         basePrice: 199,
//         imageUrl: "/images/store.jpg.png"
//       },
//       {
//         name: "Water Purifier",
//         category: "Appliances",
//         basePrice: 8999,
//         imageUrl: "/images/waterpurifier.webp"
//       },
//     ],

data:[
    {
      points: 10,
      question: "What gas do plants primarily use for photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correctAnswer: "Carbon Dioxide",
      createdAt: "2025-04-04T10:00:00Z",
      updatedAt: "2025-04-04T10:00:00Z",
      category: "SCIENCE"
    },
    {
      points: 15,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
      createdAt: "2025-04-04T10:05:00Z",
      updatedAt: "2025-04-04T10:05:00Z",
      category: "SCIENCE"
    },
    {
      points: 20,
      question: "Who discovered the theory of relativity?",
      options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
      correctAnswer: "Albert Einstein",
      createdAt: "2025-04-04T10:10:00Z",
      updatedAt: "2025-04-04T10:10:00Z",
      category: "SCIENCE"
    },
    {
      points: 10,
      question: "In which year did World War II end?",
      options: ["1942", "1945", "1950", "1939"],
      correctAnswer: "1945",
      createdAt: "2025-04-04T10:15:00Z",
      updatedAt: "2025-04-04T10:15:00Z",
      category: "HISTORY"
    },
    {
      points: 15,
      question: "Who was the first President of the United States?",
      options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
      correctAnswer: "George Washington",
      createdAt: "2025-04-04T10:20:00Z",
      updatedAt: "2025-04-04T10:20:00Z",
      category: "HISTORY"
    },
    {
      points: 20,
      question: "Which empire built the Colosseum in Rome?",
      options: ["Greek Empire", "Roman Empire", "Ottoman Empire", "Byzantine Empire"],
      correctAnswer: "Roman Empire",
      createdAt: "2025-04-04T10:25:00Z",
      updatedAt: "2025-04-04T10:25:00Z",
      category: "HISTORY"
    },
    {
      points: 10,
      question: "How many players are on a soccer team on the field?",
      options: ["9", "10", "11", "12"],
      correctAnswer: "11",
      createdAt: "2025-04-04T10:30:00Z",
      updatedAt: "2025-04-04T10:30:00Z",
      category: "SPORTS"
    },
    {
      points: 15,
      question: "Which country won the FIFA World Cup in 2018?",
      options: ["Brazil", "Germany", "France", "Argentina"],
      correctAnswer: "France",
      createdAt: "2025-04-04T10:35:00Z",
      updatedAt: "2025-04-04T10:35:00Z",
      category: "SPORTS"
    },
    {
      points: 20,
      question: "In which sport is the term 'home run' used?",
      options: ["Cricket", "Baseball", "Rugby", "Soccer"],
      correctAnswer: "Baseball",
      createdAt: "2025-04-04T10:40:00Z",
      updatedAt: "2025-04-04T10:40:00Z",
      category: "SPORTS"
    },
    {
      points: 10,
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Fe", "Cu"],
      correctAnswer: "Au",
      createdAt: "2025-04-04T10:45:00Z",
      updatedAt: "2025-04-04T10:45:00Z",
      category: "SCIENCE"
    },
    {
      points: 15,
      question: "Which ancient civilization built the pyramids of Giza?",
      options: ["Mesopotamians", "Romans", "Egyptians", "Greeks"],
      correctAnswer: "Egyptians",
      createdAt: "2025-04-04T10:50:00Z",
      updatedAt: "2025-04-04T10:50:00Z",
      category: "HISTORY"
    },
    {
      points: 20,
      question: "Which athlete holds the record for the most Olympic gold medals?",
      options: ["Usain Bolt", "Michael Phelps", "Simone Biles", "Carl Lewis"],
      correctAnswer: "Michael Phelps",
      createdAt: "2025-04-04T10:55:00Z",
      updatedAt: "2025-04-04T10:55:00Z",
      category: "SPORTS"
    }
  ]
  });

  console.log("Items seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
