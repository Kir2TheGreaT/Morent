import { defineStore } from "pinia";

export interface Review {
  id: number;
  carId: number | null; // null — общие (демо) отзывы, показываются у всех машин
  name: string;
  position: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
  isOwn?: boolean;
}

type SeedReview = Omit<Review, "carId">;
const seedReviews: SeedReview[] = [
  {
    id: 1,
    name: "Jesse Pinkman",
    position: "CEO at Alabama",
    avatar: "/avatars/JessePinkman.jpg",
    date: "28.08.2028",
    rating: 5,
    text: "Yo, the MORENT service is totally awesome, man. Prices are chill, tons of cars to pick from, and they’re all comfy and clean, makes driving super smooth. Plus the crew there is cool and polite, no stress, so the whole experience was really dope.",
  },
  {
    id: 2,
    name: "Walter White",
    position: "CEO at Nebraska",
    avatar: "/avatars/avaWhite.jpg",
    date: "28.08.2028",
    rating: 5,
    text: "I am thoroughly satisfied with the service provided by the MORENT app. The rental prices are reasonable, and there is a wide selection of reliable and comfortable vehicles. The staff conduct themselves with professionalism and courtesy, ensuring the entire process is efficient and well-managed.",
  },
  {
    id: 3,
    name: "Eminem",
    position: "Music Producer",
    avatar: "/avatars/eminem.jpg",
    date: "02.09.2028",
    rating: 5,
    text: "MORENT hit harder than a clean verse. Fast booking, no hidden drama, car was spotless and ready to go. That’s how a service should run.",
  },
  {
    id: 4,
    name: "50 Cent",
    position: "Entrepreneur",
    avatar: "/avatars/50cent.jpg",
    date: "03.09.2028",
    rating: 4,
    text: "Good value, solid cars, smooth process. I respect businesses that handle things straight and don’t waste time. MORENT does it right.",
  },
  {
    id: 5,
    name: "Ice Cube",
    position: "Actor & Producer",
    avatar: "/avatars/iceCube.webp",
    date: "04.09.2028",
    rating: 3,
    text: "Clean rides, fair prices, and no nonsense. Picked up the car, drove off, returned it easy. That’s the kind of service I mess with.",
  },
  {
    id: 6,
    name: "Albert Einstein",
    position: "Theoretical Physicist",
    avatar: "/avatars/albert.webp",
    date: "05.09.2028",
    rating: 5,
    text: "Everything is relative, but this service is absolutely excellent. The process was intuitive, efficient, and pleasantly free of complications.",
  },
  {
    id: 7,
    name: "Marie Curie",
    position: "Physicist & Chemist",
    avatar: "/avatars/Curie.webp",
    date: "05.09.2028",
    rating: 4,
    text: "A remarkably reliable service. The clarity of pricing and the quality of the vehicles demonstrate a strong commitment to excellence.",
  },
  {
    id: 8,
    name: "Isaac Newton",
    position: "Mathematician",
    avatar: "/avatars/newton.jpg",
    date: "06.09.2028",
    rating: 3,
    text: "The motion of renting a car has never been so straightforward. Every action produced a predictable and satisfactory result.",
  },
  {
    id: 9,
    name: "Nikola Tesla",
    position: "Inventor",
    avatar: "/avatars/Tesla.jpg",
    date: "06.09.2028",
    rating: 5,
    text: "An elegant system powered by simplicity and logic. MORENT feels like a service designed ahead of its time.",
  },
  {
    id: 10,
    name: "Stephen Hawking",
    position: "Cosmologist",
    avatar: "/avatars/hawking.jpg",
    date: "07.09.2028",
    rating: 4,
    text: "Navigating MORENT was easier than explaining black holes. Efficient, accessible, and impressively well-structured.",
  },
  {
    id: 11,
    name: "Alan Turing",
    position: "Computer Scientist",
    avatar: "/avatars/turing.webp",
    date: "07.09.2028",
    rating: 5,
    text: "The system behaves logically and predictably. From a computational standpoint, the user experience is near optimal.",
  },
  {
    id: 12,
    name: "Galileo Galilei",
    position: "Astronomer",
    avatar: "/avatars/Galileo.webp",
    date: "08.09.2028",
    rating: 3,
    text: "And yet, it moves — swiftly and smoothly. MORENT provides a reliable journey from start to finish.",
  },
  {
    id: 13,
    name: "Ada Lovelace",
    position: "Mathematician",
    avatar: "/avatars/Ada.avif",
    date: "08.09.2028",
    rating: 4,
    text: "The structure of this service is beautifully designed. One can appreciate the thoughtful logic behind every step.",
  },
  {
    id: 14,
    name: "Charles Darwin",
    position: "Naturalist",
    avatar: "/avatars/Darvin.webp",
    date: "09.09.2028",
    rating: 2,
    text: "Among rental services, MORENT is clearly well-adapted. It responds effectively to the needs of its environment — the customer.",
  },
  {
    id: 15,
    name: "Richard Feynman",
    position: "Theoretical Physicist",
    avatar: "/avatars/Feyman.webp",
    date: "09.09.2028",
    rating: 4,
    text: "It just works — and that’s the beauty of it. Simple, fun, and surprisingly satisfying. I’d happily use it again.",
  },
];

export const useReviewsStore = defineStore(
  "reviews",
  () => {
    // Только отзывы пользователя: демо-данные не дублируются в localStorage.
    const ownReviews = ref<Review[]>([]);

    const forCar = (carId: number): Review[] => [
      ...ownReviews.value.filter((r) => r.carId === carId),
      ...seedReviews.map((r) => ({ ...r, carId: null })),
    ];

    function addReview(carId: number, text: string, rating: number) {
      ownReviews.value.unshift({
        id: Date.now(),
        carId,
        name: "You",
        position: "Guest",
        avatar: "/noImage.webp",
        date: new Date().toLocaleDateString("ru-RU"),
        rating,
        text,
        isOwn: true,
      });
    }

    function removeReview(id: number) {
      ownReviews.value = ownReviews.value.filter((r) => r.id !== id);
    }

    return { ownReviews, forCar, addReview, removeReview };
  },
  { persist: true },
);