"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Projects",
      [
        {
          name: "Real Estate Website",
          start_date: "2023-08-01T07:00:00.000Z",
          end_date: "2024-08-12T07:00:00.000Z",
          description:
            "Website Real Estate: Temukan Rumah Impian Anda dengan Kemudahan dan Kepercayaan. Selamat datang di Website Real Estate, destinasi online yang dirancang khusus untuk membantu Anda menemukan properti yang sesuai dengan kebutuhan dan impian Anda. Dengan jaringan luas agen terpercaya dan beragam pilihan properti, kami berkomitmen untuk menjadi mitra Anda dalam perjalanan mencari tempat yang Anda sebut rumah.",
          technologies: ["socket-io", "react", "typescript"],
          image: "/images/project1.png",
          createdAt: new Date("2023-08-01T12:00:00"),
          updatedAt: new Date("2023-08-01T12:00:00"),
        },
        {
          name: "Belajar Ngaji Website",
          start_date: "2023-08-01T07:00:00.000Z",
          end_date: "2024-08-12T07:00:00.000Z",
          description:
            "Website Belajar Ngaji: Menemani Perjalanan Spiritual Anda Menuju Kedekatan dengan Al-Quran. Selamat datang di website Belajar Ngaji, tempat di mana Anda dapat memulai atau melanjutkan perjalanan spiritual Anda dalam memahami dan menghafal Al-Quran dengan mudah dan nyaman. Kami telah merancang platform ini dengan penuh dedikasi untuk membantu Anda memperdalam hubungan dengan Kitab Suci dan memperluas pemahaman Anda tentang ajaran Islam.",
          technologies: ["react", "node-js"],
          image: "/images/project2.png",
          createdAt: new Date("2023-07-15T08:01:00"),
          updatedAt: new Date("2023-07-15T08:01:00"),
        },
        {
          name: "Floobotics",
          start_date: "2023-08-01T07:00:00.000Z",
          end_date: "2024-08-12T07:00:00.000Z",
          description:
            "Website Flobotics: Menemani Perjalanan Spiritual Anda Menuju Kedekatan dengan Al-Quran. Selamat datang di website Belajar Ngaji, tempat di mana Anda dapat memulai atau melanjutkan perjalanan spiritual Anda dalam memahami dan menghafal Al-Quran dengan mudah dan nyaman. Kami telah merancang platform ini dengan penuh dedikasi untuk membantu Anda memperdalam hubungan dengan Kitab Suci dan memperluas pemahaman Anda tentang ajaran Islam.",
          technologies: ["react"],
          image: "/images/project3.png",
          createdAt: new Date("2023-07-15T08:01:00"),
          updatedAt: new Date("2023-07-15T08:01:00"),
        },
        {
          name: "PERCOBAAN",
          start_date: "2023-08-01T07:00:00.000Z",
          end_date: "2024-08-12T07:00:00.000Z",
          description:
            "Website Flobotics: Menemani Perjalanan Spiritual Anda Menuju Kedekatan dengan Al-Quran. Selamat datang di website Belajar Ngaji, tempat di mana Anda dapat memulai atau melanjutkan perjalanan spiritual Anda dalam memahami dan menghafal Al-Quran dengan mudah dan nyaman. Kami telah merancang platform ini dengan penuh dedikasi untuk membantu Anda memperdalam hubungan dengan Kitab Suci dan memperluas pemahaman Anda tentang ajaran Islam.",
          technologies: ["react"],
          image: "/images/project5.png",
          createdAt: new Date("2023-07-15T08:01:00"),
          updatedAt: new Date("2023-07-15T08:01:00"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
