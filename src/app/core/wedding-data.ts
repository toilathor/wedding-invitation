import {
  AlbumData,
  BankData,
  BannerData,
  GuestMessage,
  IntroData,
  InvitationData,
  StoryData,
  TimelineData,
  WeddingData,
  WeddingEventItem,
} from "../models/wedding-data.model";

export const WEDDING_DATA: WeddingData = {
  audioUrl: "assets/music/Beautiful-In-White.mp3",
  audioUrls: ["assets/music/Beautiful-In-White.mp3"],
  banner: <BannerData>{
    groom: "Quang Thọ",
    bride: "Thúy Hiền",
    title: "{We} cưới",
    day: "28",
    month: "11",
    year: "2026",
    image1: "assets/images/couple/banner_left.webp",
    image2: "assets/images/couple/banner_right.webp",
    imageDecorLeft: "assets/images/templates/sangtrong/7.png",
    imageDecorRight: "assets/images/templates/sangtrong/img/04.png",
  },

  invitation: <InvitationData>{
    time: "13:00, Thứ Bảy",
    day: "28",
    month: "11",
    year: "2026",
    location: "Thiết Trụ, Mễ Sở, Hưng Yên",
    subDescription: "Sự hiện diện của {you} là niềm vinh dự của {we}!",
    descriptionHtml:
      "Hành trình yêu thương của {we} sẽ càng ý nghĩa hơn khi có sự chứng kiến và chúc phúc từ {youPl}. Cảm ơn {you} đã dành thời gian để cùng {we} lưu giữ khoảnh khắc đặc biệt này. 💍",
    countdownDate: "2026-11-28T06:30:00.000Z", // 13:30 UTC+7 (28/11/2026)
  },

  introduction: <IntroData>{
    title: "Và.. Ngày ấy đã tới",
    nameGroom: "Quang Thọ",
    nameBride: "Thúy Hiền",
    imageGroom: "assets/images/couple/groom.webp",
    imageBride: "assets/images/couple/bride.webp",
    contentGroom:
      "Mỗi lời chúc phúc và sự hiện diện của {you} trong ngày đặc biệt này chính là món quà vô giá với {weFormal}. Hãy cùng {weFormal} tận hưởng niềm vui, tiếng cười và sự ấm áp trong ngày hạnh phúc nhất này!",
    contentBride:
      "{WeFormal} rất vui mừng được chia sẻ khoảnh khắc quan trọng nhất của cuộc đời mình với gia đình, bạn bè và những người thân yêu. Ngày cưới không chỉ là sự khởi đầu của hành trình mới mà còn là dịp để {weFormal} cùng {youPl} tạo nên những kỷ niệm đáng nhớ.",
    description:
      "Thật vui vì được gặp và đón tiếp {youPl} trong một dịp đặc biệt - Ngày cưới của {we} . {We} muốn gửi đến {you} những lời cảm ơn sâu sắc nhất và để {you} biết rằng {we} rất hạnh phúc khi thấy {you} ở đó. Cảm ơn {youPl} rất nhiều vì sự hiện diện cùng những lời chúc tốt đẹp mà {you} đã dành cho {we} {nha}!",
  },

  story: <StoryData>{
    title: "Chuyện {we}",
    contentHtml:
      "Mỗi câu chuyện tình yêu đều có một khởi đầu riêng. Hành trình của {we} được viết lên từ những lần gặp gỡ, những nụ cười, sự đồng hành và những quyết định quan trọng của cuộc đời. Mời {you} cùng nhìn lại những cột mốc đáng nhớ trên chặng đường yêu thương ấy. ❤️",
    image: "assets/images/couple/story.webp",
  },

  timeline: <TimelineData>{
    mainTitle: "Cột mốc",
    milestone: [
      {
        day: "12",
        month: "04",
        year: "2023",
        title: "Lần đầu gặp nhau",
        content:
          "Một cuộc gặp gỡ tình cờ, mở đầu cho hành trình yêu thương kéo dài đến hôm nay. Không ai ngờ rằng khoảnh khắc ấy lại trở thành điểm khởi đầu cho câu chuyện hạnh phúc của {we}.",
        picture: "assets/images/couple/timeline_1.webp",
      },
      {
        day: "07",
        month: "09",
        year: "2025",
        title: "Cầu hôn",
        content:
          "Một chiếc nhẫn, một lời ngỏ và một câu trả lời đồng ý. Từ khoảnh khắc ấy, {we} quyết định cùng nhau bước tiếp trên hành trình trọn đời.",
        picture: "assets/images/couple/timeline_2.webp",
      },
      {
        day: "14",
        month: "03",
        year: "2026",
        title: "Dạm ngõ",
        content:
          "Ngày hai gia đình chính thức gặp gỡ và cùng chia sẻ niềm vui về chuyện trăm năm. Đây là cột mốc ý nghĩa, đánh dấu sự gắn kết và chúc phúc cho hành trình của {we}.",
        picture: "assets/images/couple/timeline_3.webp",
      },
    ],
  },

  events: <WeddingEventItem[]>[
    {
      title: "Lễ nhà gái",
      dateTime: "2026-11-28T10:00:00",
      displayTime: "10:00",
      displayDate: "28 . 11 . 2026",
      address: "thôn Đồng Mới, Đạo Trù, Phú Thọ",
      link: "https://www.google.com/maps?q=15.8337222,108.1531111",
      icon: "assets/images/decor/event-rings.webp",
    },
    {
      title: "LỄ NHÀ TRAI",
      dateTime: "2026-11-28T13:00:00",
      displayTime: "13:00",
      displayDate: "28 . 11 . 2026",
      address: "thôn Thiết Trụ, Mễ Sở, Hưng Yên",
      link: "https://www.google.com/maps?q=15.8336667,108.1063056",
      icon: "assets/images/decor/event-car.webp",
    },
    {
      title: "Tiệc cưới",
      dateTime: "2026-11-28T15:00:00",
      displayTime: "15:00",
      displayDate: "28 . 11 . 2026",
      address: "thôn Thiết Trụ, Mễ Sở Hưng Yên",
      link: "https://www.google.com/maps?q=15.8343889,108.1074444",
      icon: "assets/images/decor/event-cake.webp",
    },
  ],

  album: <AlbumData>{
    title: "Album ảnh cưới",
    albums: [
      "assets/images/gallery/album_1.webp",
      "assets/images/gallery/album_2.webp",
      "assets/images/gallery/album_3.webp",
      "assets/images/gallery/album_4.webp",
      "assets/images/gallery/album_5.webp",
      "assets/images/gallery/album_6.webp",
      "assets/images/gallery/album_7.webp",
      "assets/images/gallery/album_8.webp",
      "assets/images/gallery/album_9.webp",
      "assets/images/gallery/album_10.webp",
      "assets/images/gallery/album_11.webp",
      "assets/images/gallery/album_12.webp",
      "assets/images/gallery/album_13.webp",
      "assets/images/gallery/album_14.webp",
      "assets/images/gallery/album_15.webp",
      "assets/images/gallery/album_16.webp",
    ],
  },

  messages: <GuestMessage[]>[],

  bank: <BankData>{
    nameGroom: "Lê Quang Thọ",
    bankNameGroom: "VietinBank",
    imageBankGroom: "assets/images/bank/qr_groom.webp",
    nameBride: "Nguyễn Thúy Hiền",
    bankNameBride: "Vietcombank",
    imageBankBride: "assets/images/bank/qr_bride.webp",
    description:
      "Nếu có thể, {we} rất mong {you} tới tham dự Đám cưới, chung vui và Mừng cưới trực tiếp {nhe}{smile}. Cảm ơn {you} rất nhiều!",
    coverImage: "assets/images/couple/bank_cover.webp",
  },
};
