<template>
  <section ref="reviewsSection" class="mainHeadReviews">
    <h2 class="headerReviews">
      Reviews
      <span class="badgeReviews">
        <span>{{ reviews.length }}</span>
      </span>
    </h2>

    <form class="addReviewForm" @submit.prevent="submitReview">
      <label for="review-text" class="visually-hidden">Your review</label>
      <textarea
        id="review-text"
        v-model="newReviewText"
        placeholder="Write your review..."
        class="reviewArea"
      ></textarea>

      <div class="formActions">
        <div class="ratingSelect">
          <label for="review-rating">Rating:</label>
          <select id="review-rating" v-model="newReviewRating">
            <option v-for="n in 5" :key="n" :value="n">{{ n }} Stars</option>
          </select>
        </div>

        <button
          type="submit"
          :disabled="!newReviewText.trim()"
          class="postButton"
        >
          Post Review
        </button>
      </div>
    </form>

    <div class="mainReviews">
      <TransitionGroup name="list">
        <article
          v-for="review in visibleReviews"
          :key="review.id"
          class="oneReview"
        >
          <div class="topOneReview">
            <div class="profile">
              <img
                :src="review.avatar"
                alt=""
                class="avatarProfile"
                loading="lazy"
              />
              <div class="userReviewInfotmation">
                <div class="nameInformation">{{ review.name }}</div>
                <div class="userInformation">{{ review.position }}</div>
              </div>
            </div>

            <div class="ratingReview">
              <div class="dateReview">{{ review.date }}</div>

              <button
                v-if="review.isOwn"
                type="button"
                @click="reviewsStore.removeReview(review.id)"
                class="deleteBtn"
              >
                Delete
              </button>

              <div
                class="ratingStars"
                role="img"
                :aria-label="`Rating: ${review.rating} out of 5`"
              >
                <Star v-for="i in review.rating" :key="i"></Star>
              </div>
            </div>
          </div>

          <div class="textReview">
            <p>{{ review.text }}</p>
          </div>
        </article>
      </TransitionGroup>
    </div>

    <div class="showAll" v-if="reviews.length > 3">
      <div class="showAllButton" @click="handleToggle" ref="bottomAnchor">
        <button type="button" :aria-expanded="isExpanded">
          <span class="showAllText">
            {{ isExpanded ? "Hide" : "Show All" }}
          </span>
        </button>
        <ArrowDown :style="arrowStyle" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from "vue";
import ArrowDown from "../icons/arrow-down.vue";
import Star from "../icons/star.vue";
import { useReviewsStore, type Review } from "@/stores/reviews";

const props = defineProps<{
  carId: number;
}>();

const reviewsStore = useReviewsStore();

const reviewsSection = ref<HTMLElement | null>(null);
const bottomAnchor = ref<HTMLElement | null>(null);
const isExpanded = ref<boolean>(false);

const newReviewText = ref<string>("");
const newReviewRating = ref<number>(5);

const reviews = computed<Review[]>(() => reviewsStore.forCar(props.carId));

const visibleReviews = computed<Review[]>(() =>
  isExpanded.value ? reviews.value : reviews.value.slice(0, 3),
);

const arrowStyle = computed<Record<string, string>>(() => ({
  transform: isExpanded.value ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.5s ease",
}));

const submitReview = (): void => {
  const text = newReviewText.value.trim();
  if (!text) return;

  reviewsStore.addReview(props.carId, text, newReviewRating.value);
  newReviewText.value = "";
  newReviewRating.value = 5;
};

const handleToggle = async (): Promise<void> => {
  isExpanded.value = !isExpanded.value;
  await nextTick();
  (isExpanded.value ? bottomAnchor : reviewsSection).value?.scrollIntoView({
    behavior: "smooth",
    block: isExpanded.value ? "end" : "start",
  });
};
</script>

<style>
.mainHeadReviews {
  background-color: var(--primary-0);
  border-radius: 10px;

  .headerReviews {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 1.5rem 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--secondary-500);

    @media (max-width: 1000px) {
      padding: 1rem 1rem 0.5rem;
    }

    .badgeReviews {
      background-color: var(--primary-500);
      border-radius: 4px;
      padding: 0.375rem 0.75rem;
      display: flex;

      span {
        font-size: 0.75rem;
        color: var(--primary-0);
      }
    }
  }

  .addReviewForm {
    padding: 0 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (max-width: 1000px) {
      padding: 0 1rem 1rem;
    }

    .reviewArea {
      width: 96%;
      min-height: 100px;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid var(--secondary-200);
      background-color: var(--primary-0);
      color: var(--secondary-500);
      font-size: 0.875rem;
      font-family: inherit;
      resize: none;
      @media (min-width: 1px) and (max-width: 1280px) {
        width: 92%;
      }
    }

    .formActions {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ratingSelect {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--secondary-400);
        font-size: 0.875rem;

        select {
          border: 1px solid var(--secondary-200);
          border-radius: 5px;
          padding: 0.25rem;
        }
      }

      .postButton {
        background-color: var(--primary-500);
        color: var(--primary-0);
        padding: 0.625rem 1.25rem;
        border-radius: 5px;
        font-weight: 600;
        font-size: 0.875rem;
        border: none;
        cursor: pointer;

        &:disabled {
          opacity: 0.5;
        }
      }
    }

    @media (max-width: 600px) {
      gap: 0.75rem;

      .reviewArea {
        min-height: 80px;
        font-size: 0.8rem;
        padding: 0.75rem;
      }

      .formActions {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;

        .ratingSelect {
          width: 100%;
          justify-content: space-between;

          span {
            font-size: 0.8rem;
          }

          select {
            flex: 1;
            padding: 0.4rem;
            font-size: 0.8rem;
          }
        }

        .postButton {
          width: 100%;
          padding: 0.75rem;
          font-size: 0.9rem;
          border-radius: 8px;
        }
      }
    }
  }

  .mainReviews {
    padding: 0 1.5rem 1.5rem;

    @media (max-width: 1000px) {
      padding: 0 1rem 1.25rem;
    }

    .oneReview {
      .topOneReview {
        display: flex;
        justify-content: space-between;
        padding-top: 1.5rem;

        @media (max-width: 1000px) {
          padding-top: 1rem;
        }

        .profile {
          display: flex;
          align-items: end;
          gap: 1rem;

          .avatarProfile {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            object-fit: cover;

            @media (max-width: 1000px) {
              width: 44px;
              height: 44px;
            }
          }

          .userReviewInfotmation {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .nameInformation {
              color: var(--secondary-500);
              font-size: 1.25rem;
              font-weight: 700;

              @media (max-width: 1000px) {
                font-size: 1rem;
              }
            }

            .userInformation {
              color: var(--secondary-300);
              font-size: 0.875rem;

              @media (max-width: 1000px) {
                font-size: 0.75rem;
              }
            }
          }
        }

        .ratingReview {
          display: flex;
          flex-direction: column;
          align-items: end;
          gap: 0.5rem;

          .dateReview {
            color: var(--secondary-300);
            font-size: 0.875rem;

            @media (max-width: 1000px) {
              font-size: 0.75rem;
            }
          }

          .deleteBtn {
            background: none;
            border: none;
            color: #ed3f3f;
            font-size: 0.75rem;
            text-decoration: underline;
            cursor: pointer;
          }

          .ratingStars {
            display: flex;

            .icon-container {
              color: #fbad39;

              @media (max-width: 1000px) {
                width: 0.75rem;
                height: 0.75rem;
              }
            }
          }
        }
      }

      .textReview {
        padding-top: 0.75rem;
        padding-left: 4.75rem;

        @media (max-width: 1000px) {
          padding-left: 0;
          padding-top: 1rem;
        }

        p {
          margin: 0;
          line-height: 200%;
          color: var(--secondary-400);
          font-size: 0.875rem;

          @media (max-width: 1000px) {
            font-size: 0.75rem;
          }
        }
      }
    }
  }

  .showAll {
    padding-bottom: 1.5rem;

    .showAllButton {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;

      .showAllText {
        font-size: 1rem;
        font-weight: 600;
        color: var(--secondary-300);

        @media (max-width: 1000px) {
          font-size: 0.875rem;
        }
      }
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
