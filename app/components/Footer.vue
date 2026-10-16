<template>
  <footer class="footer">
    <div class="title">
      <NuxtLink to="/" class="name">MORENT</NuxtLink>
      <div class="subscription">
        Our vision is to provide convenience <br />
        and help increase your sales business.
      </div>
    </div>
    <div class="footer_all">
      <div class="resources about">
        <h3>About</h3>
        <p>How it works</p>
        <p>Featured</p>
        <p>Partnership</p>
        <p>Business Relation</p>
      </div>
      <div class="resources socials">
        <h3>Socials</h3>
        <p>Discord</p>
        <p>Instagram</p>
        <p>Twitter</p>
        <p>Facebook</p>
      </div>
      <div class="resources community">
        <h3>Community</h3>
        <p>Events</p>
        <p>Blog</p>
        <p>Podcast</p>
        <p>Invite a friend</p>
      </div>
    </div>
    <div class="footers">
      <div class="footer_down">
        <h5>Privacy & Policy</h5>
        <h5 class="small_screen">Terms & Condition</h5>
      </div>
      <div class="footer_down1">
        <h5>Terms & Condition</h5>
      </div>
      <div class="footer_down2">
        <h5>
          ©&nbsp;{{ year }} MORENT. All rights reserved
        </h5>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const year = new Date().getFullYear();
</script>

<style>
.footer {
  display: flex;
  flex-direction: column;
  background-color: var(--backgroundpages);
  .title {
    display: flex;
    flex-direction: column;
    padding-top: 3rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    gap: 1rem;
    .name {
      font-weight: bold;
      color: var(--primary-500);
      font-size: 1.5rem;
      cursor: pointer;
      &:hover {
        transform: scale(1.2);
        transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
    }

    .subscription {
      color: var(--secondary-300);
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 200%;
    }
  }

  .footer_all {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-top: 3rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    .resources {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      &.about {
        padding-right: 4.063rem;
        padding-bottom: 3rem;
      }

      h3 {
        font-weight: 600;
        color: var(--secondary-500);
        font-size: 1.25rem;
        margin: 0;
        &:hover {
          transform: scale(1.2);
          transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
      }

      p {
        font-weight: 500;
        color: var(--secondary-300);
        font-size: 1rem;
        margin: 0;
        &:hover {
          transform: scale(1.2);
          transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
      }
    }
  }

  .footers {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding-top: 3rem;

    .footer_down {
      padding-left: 1.5rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      h5 {
        font-weight: 600;
        color: var(--secondary-500);
        font-size: 0.75rem;
        margin: 0;
        &:hover {
          transform: scale(1.2);
          transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
      }

      .small_screen {
        display: none;
      }
    }

    .footer_down1 {
      padding-right: 1.5rem;
      h5 {
        font-weight: 600;
        color: var(--secondary-500);
        font-size: 0.75rem;
        margin: 0;
        &:hover {
          transform: scale(1.2);
          transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
      }
    }

    .footer_down2 {
      display: flex;
      padding-left: 1.5rem;
      padding-bottom: 1.5rem;
      h5 {
        font-weight: 600;
        color: var(--secondary-500);
        font-size: 0.75rem;
        margin: 0;
        &:hover {
          transform: scale(1.2);
          transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
      }
    }
  }
}

@media (min-width: 410px) and (max-width: 1439px) {
  .footer {
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .footer_all {
      display: flex;
      justify-content: space-between;
      text-align: center;
      .resources {
        &.about {
          padding-right: 0;
        }
      }
    }
    .footers {
      .footer_down {
        padding-bottom: 1.5rem;
      }
      .footer_down1 {
        padding-bottom: 1.5rem;
      }
    }
  }
}

@media (min-width: 1440px) {
  .footer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    background-color: var(--primary-0);
    max-width: 1433px;
    margin: 0 auto;
    padding: 0;

    .title {
      padding-left: 3.75rem;
      padding-bottom: 10.75rem;
      padding-top: 5rem;
      .name {
        font-size: 2rem;
      }

      .subscription {
        font-size: 1rem;
      }
    }

    .footer_all {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 4rem;
      padding-top: 1rem;
      margin-left: auto;
      padding-bottom: 3.75rem;
      padding-right: 4rem;

      .resources {
        &.about {
          margin-right: 0;
          padding-right: 0;
          padding-bottom: 0;
        }
        gap: 1.5rem;
        &.community {
          order: 2;
        }
        &.socials {
          order: 3;
        }
      }
    }

    .footers {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-top: 1px rgba(19, 19, 19, 0.16) solid;
      margin-left: 4rem;
      margin-right: 4rem;
      .footer_down1 {
        display: none;

        h5 {
          font-size: 1rem;
        }
      }

      .footer_down {
        padding-top: 2.25rem;
        padding-bottom: 4rem;
        padding-right: 4rem;
        margin-right: -4rem;
        order: 2;
        display: flex;
        flex-direction: row;
        gap: 3.75rem;

        h5 {
          font-size: 1rem;
        }

        .small_screen {
          display: flex;
        }
      }

      .footer_down2 {
        padding-left: 4rem;
        padding-top: 2.25rem;
        padding-bottom: 4rem;
        margin-left: -4rem;
        order: 1;

        h5 {
          font-size: 1rem;
        }
      }
    }
  }
}
.footer .name {
  text-decoration: none;
  display: inline-block;
}
</style>
