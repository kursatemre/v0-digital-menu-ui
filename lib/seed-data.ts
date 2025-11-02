export const SEED_CATEGORIES = [
  { id: "c3a0330e-21af-4ea0-9856-bfca2c984c3e", name: "Günün Menüsü", image: "", displayOrder: 1 },
  {
    id: "4ca3431f-5082-4215-8260-c756269364ff",
    name: "Kahvaltılıklar",
    image: "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/sicak-kahvalti-tabagi-8348.jpg",
    displayOrder: 2,
  },
  { id: "13ac044f-28cd-42c7-a2a0-67f5670a20c6", name: "Makarnalar", image: "", displayOrder: 3 },
  { id: "ba64a7e8-ea3a-4748-b40a-1d4a157c0836", name: "Köfteler", image: "", displayOrder: 3 },
  { id: "701c9fb5-b2f8-4d14-a29b-78d07353400a", name: "Tavuk Izgara Çeşitleri", image: "", displayOrder: 4 },
  { id: "98d5ca18-0687-4943-88fe-e4d6da07ef84", name: "Salatalar", image: "", displayOrder: 5 },
  { id: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff", name: "İçecekler", image: "", displayOrder: 6 },
  { id: "52db0bb2-a3fa-4775-92d1-095f37f5c205", name: "Hamburger & Patates", image: "", displayOrder: 4 },
]

export const SEED_PRODUCTS = [
  {
    id: "abfd2344-930c-47b0-adf9-cb2c8caad7a6",
    name: "Etli Nohut, Pilav, Yoğurt veya Salata",
    description: "",
    price: 250,
    categoryId: "c3a0330e-21af-4ea0-9856-bfca2c984c3e",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/images%20%282%29-cLDhPhUNd4oFL0yrPxaISk6YyChV7N.jfif",
  },
  {
    id: "237e466a-913c-4df8-8464-e22a7c2ffd12",
    name: "Kahvaltı Tabağı",
    description: "Haşlanmış yumurta, Peynir, zeytin, domates, salatalık, reçel, tereyağ, bal, Sınırsız Çay",
    price: 200,
    categoryId: "4ca3431f-5082-4215-8260-c756269364ff",
    image: "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/kahvalti_tabagi-SU9m006Cn3a0nI1uUi9Nb0LhEOI2Fd.jpg",
  },
  {
    id: "3c4a2bad-55bf-45fa-b64e-dc057effa0d9",
    name: "Sigara Böreği",
    description: "4 adet",
    price: 75,
    categoryId: "4ca3431f-5082-4215-8260-c756269364ff",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/hafif_sigara_boregi-62d641dd-3b62-47e2-b0e2-96870bc31cf3-FBl8kqZhoQoZK0qP6WD9aBAiChX06j.jpg",
  },
  {
    id: "59e9539f-8108-4847-acd1-ccb665db1564",
    name: "Menemen",
    description: "",
    price: 130,
    categoryId: "4ca3431f-5082-4215-8260-c756269364ff",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/images%20%283%29-43iffNQQwgG3ZQqr7QfHxW8EQOYEf1.jfif",
  },
  {
    id: "6f17251c-2115-41e8-a768-2f4779c9c507",
    name: "Ayvalık Tostu",
    description: "",
    price: 150,
    categoryId: "4ca3431f-5082-4215-8260-c756269364ff",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/1200x675-ayvalik-tostu-1725955639211-FsrNcS3ky6D78f1JjNSW9QVA2kNJLX.jpg",
  },
  {
    id: "7232932c-cfbb-4e10-9dbb-05a1fa052663",
    name: "Kumru Tost",
    description: "",
    price: 150,
    categoryId: "4ca3431f-5082-4215-8260-c756269364ff",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/1743207130332_1000x750-u3Fe0h7lX0Jvogc9gwSHFUxQtbPZ4T.webp",
  },
  {
    id: "f884ed41-a6fd-4c56-980b-3bffce7f4d10",
    name: "Omlet",
    description: "",
    price: 120,
    categoryId: "4ca3431f-5082-4215-8260-c756269364ff",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/Tezza-1983-scaled-e1683895911694-sJBL9UO3snuMhKPQrm1sWxwLmUs7f0.jpg",
  },
  {
    id: "63512d81-c98d-4e73-92fb-00bee0c4afc7",
    name: "Bolonez",
    description: "",
    price: 250,
    categoryId: "13ac044f-28cd-42c7-a2a0-67f5670a20c6",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/bolonez_soslu_makarna1-MbveYqh1LYqLG7T5tImTO5V3YoPhNS.webp",
  },
  {
    id: "6957faf0-a1cd-4552-bfa9-ef07648e4c8d",
    name: "Arabiata (acılı)",
    description: "Özel domates sosu, mısır, parmesan",
    price: 175,
    categoryId: "13ac044f-28cd-42c7-a2a0-67f5670a20c6",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/penne-arrabbiata-db9c-Nli64Vp5vvL1EajihMvC0v1zypVPKU.jpg",
  },
  {
    id: "6f316653-a100-4771-b82e-06acf2620501",
    name: "Alfredo",
    description: "Parmesan, Krema, Tavuk, Makarna",
    price: 200,
    categoryId: "13ac044f-28cd-42c7-a2a0-67f5670a20c6",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/images%20%284%29-o8TySiIL28zV59g4gUwK2RmNftuI4q.jfif",
  },
  {
    id: "8238b0c6-ccaf-4296-82cb-44e04bfa5643",
    name: "Köri Soslu Kremalı Tavuklu Makarna",
    description: "",
    price: 200,
    categoryId: "13ac044f-28cd-42c7-a2a0-67f5670a20c6",
    image: "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/hq720-LFVotGvkL0Z5LpJwpTjkwgpDqcJf6m.jpg",
  },
  {
    id: "84e3b4f3-8450-4677-93d6-9276919bfe51",
    name: "Dört Peynirli Penne",
    description: "Krema, Tulum Peynirleri, Parmesan, Roka, Fesleğen",
    price: 200,
    categoryId: "13ac044f-28cd-42c7-a2a0-67f5670a20c6",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/images%20%285%29-i7ofSzbq7k7kcgzGGCfCL1MB8zLhwj.jfif",
  },
  {
    id: "bd3708f4-d0fc-49b3-9940-6e952538e3ca",
    name: "Napoliten",
    description: "Özel domates sosu, mısır, parmesan",
    price: 175,
    categoryId: "13ac044f-28cd-42c7-a2a0-67f5670a20c6",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/penne-pomodoro-350x360-rDFFES2h3uKzuLgMtu0VtO2pk0KbjR.webp",
  },
  {
    id: "c31d7285-1bcc-4550-894c-01d354930c82",
    name: "Ton Balıklı Makarna",
    description: "",
    price: 200,
    categoryId: "13ac044f-28cd-42c7-a2a0-67f5670a20c6",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/ton-balikli-kremali-makarna-c196ff19-6ced-4f72-8ae4-bfe27cae92c2-Hi7nP4sHM9QH6pxwPobGI1kfk2iCtN.jpg",
  },
  {
    id: "c73d9da6-5021-4c91-95c1-502262bfa8a2",
    name: "Pesto Soslu Makarna",
    description: "",
    price: 200,
    categoryId: "13ac044f-28cd-42c7-a2a0-67f5670a20c6",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/pesto-soslu-makarna-tavuk-dunyasi-tarifi-600x400-YIdtVOdNdotdgyolxS04tVdxowZklA.webp",
  },
  {
    id: "1c2a7c37-482b-45f0-803a-f9e53a86172e",
    name: "Üç Çeyrek Köfte",
    description: "",
    price: 300,
    categoryId: "ba64a7e8-ea3a-4748-b40a-1d4a157c0836",
    image: "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/3ceyrek-KCMkHLh81R98BB4aLbdrXfs2DamgZu.jpg",
  },
  {
    id: "54479f1c-3c1d-4a3c-b886-d1b507e7de3b",
    name: "Yarım Ekmek Köfte",
    description: "",
    price: 200,
    categoryId: "ba64a7e8-ea3a-4748-b40a-1d4a157c0836",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/kofte_ekmek_yarYm-EfbYUdEND8yQJfF296wO2ePiAc0MeW.jpg",
  },
  {
    id: "b96ca8ba-985c-4c5d-b53a-005b3f1d1e96",
    name: "Köfte Izgara",
    description: "Pilav, Yeşillik, Patates kızartması, Közlenmiş domates ve Biber eşliğinde",
    price: 250,
    categoryId: "ba64a7e8-ea3a-4748-b40a-1d4a157c0836",
    image: "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/main-header-GWsX8vMx54SizUZYXI2juNBMP08lxq.webp",
  },
  {
    id: "d38ec8c3-8631-408a-9966-325143d0a693",
    name: "Akhisar Köfte Porsiyon",
    description: "",
    price: 275,
    categoryId: "ba64a7e8-ea3a-4748-b40a-1d4a157c0836",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/0x0-akhisar-kofte-tarifi-akhisar-kofte-yapilisi-malzemeleri-ve-puf-noktalari-neler-1699359857626-g4LrhI8S8sfUyWq2y1NUdZpYCLR2vK.jpg",
  },
  {
    id: "b40f72fe-8efa-46ef-97b2-7d8a72463bcc",
    name: "Tavuk Izgara İncik",
    description: "Makarna veya Patates kızartması, közlenmiş domates ve biber eşliğinde",
    price: 275,
    categoryId: "701c9fb5-b2f8-4d14-a29b-78d07353400a",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/1647977563359_500x375-tFsiuApdheXtoKimn6gqtQkZxIS6oC.jpeg",
  },
  {
    id: "d61e5abd-c939-40e7-a57a-a46c23fd019a",
    name: "Tavuk Izgara Bonfile",
    description: "Makarna veya  Patates kızartması, közlenmiş domates  biber eşliğinde",
    price: 275,
    categoryId: "701c9fb5-b2f8-4d14-a29b-78d07353400a",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/aac99-olive6867_izgara-tavuk-bonfi-le-qa6r6QShLhie269bgEK1pE2Ww4AluD.jpg",
  },
  {
    id: "3c2e49f4-ea26-4deb-b119-e726db8ca350",
    name: "Tavuklu Salata",
    description: "Mevsim yeşillikleri, tavuk parçaları, mısır, közlenmiş kapya biber, zeytin",
    price: 250,
    categoryId: "98d5ca18-0687-4943-88fe-e4d6da07ef84",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/tavuklu-salata-600x400-g3UOMAxscZUbX6KempY9luq6oEy9of.webp",
  },
  {
    id: "a59827db-c078-4851-93fa-355ea4c8fb00",
    name: "Ton Balıklı Salata",
    description: "Mevsim yeşillikleri, ton balığı, mısır, közlenmiş kapya biber, zeytin",
    price: 250,
    categoryId: "98d5ca18-0687-4943-88fe-e4d6da07ef84",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/ton-balikli-salata-4-JEpaQ05wlOAm8qXs9c99WbdljXqe95.webp",
  },
  {
    id: "0ebbdb37-e909-4b48-8f50-65d0d074a518",
    name: "Sade soda",
    description: "",
    price: 20,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image: "",
  },
  {
    id: "17d3e4fe-3388-434f-8c74-ffce63987b34",
    name: "Kido meyveli süt",
    description: "",
    price: 30,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image: "",
  },
  {
    id: "44122441-07e8-4352-877f-c8e2f42f23a1",
    name: "Sprite kutu",
    description: "",
    price: 60,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image: "",
  },
  {
    id: "8d1f1da5-729b-4a66-bc70-c1cae5a40c81",
    name: "Kutu Kola",
    description: "",
    price: 60,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/8011001_yan-7eca8d-1650x1650-qFsaGE5KbBoSyvQyP9j0ndTsJi6lEW.jpg",
  },
  {
    id: "97018c22-a149-4037-b946-078197c9ae3c",
    name: "Meyveli soda",
    description: "",
    price: 30,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image: "",
  },
  {
    id: "bce032d5-a86e-41c0-a4b9-f861ca40432e",
    name: "Ayran",
    description: "",
    price: 20,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image: "",
  },
  {
    id: "b2d71262-72be-4023-8df1-90e405c0b4e0",
    name: "Sprite cam",
    description: "",
    price: 40,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image: "",
  },
  {
    id: "c3674315-b3ba-4701-97de-042733dd91d4",
    name: "Şalgam",
    description: "",
    price: 40,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image: "",
  },
  {
    id: "e025a9ee-22e2-48cb-a439-aca5a701d002",
    name: "Şişe Kola",
    description: "",
    price: 40,
    categoryId: "6ddc7415-3f9d-4ded-a7a3-4139a84422ff",
    image: "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/110000004882727-VRyfRD5WBh2LYegHA3lyR4uCGkWd7O.jpg",
  },
  {
    id: "9513b58f-0b51-403f-a1e5-a21d089d327c",
    name: "Patates Tabağı",
    description: "",
    price: 100,
    categoryId: "52db0bb2-a3fa-4775-92d1-095f37f5c205",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/Pommes-Frites-Belgium-2048x1366-1-3GAo6twqiDFpynH7DNJ2ANJ9ETLHIs.jpg",
  },
  {
    id: "9d1a1f02-1fab-4408-aeeb-3313034b9ae6",
    name: "Hamburger Menü",
    description: "Burger Köfte, Ev yapımı burger ekmeği, özel hamburger sosu, cheddar, patates kızartması",
    price: 300,
    categoryId: "52db0bb2-a3fa-4775-92d1-095f37f5c205",
    image:
      "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/pratik-lezzetler-cheddar-peynirli-hamburger-1-x3jcM39Z9wv8mb1HhlicNzWpuvvR53.webp",
  },
]

export const SEED_SETTINGS = {
  background_color: "#f2eded",
  header_bg_color: "#f2eded",
  header_title: "Menümüz",
  header_subtitle: "Lezzetli yemeklerimizi keşfedin!",
  header_logo_url:
    "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/Ball%C4%B1%20Hardal-Njr4HUBvTdcsLAaL1yhlNoM1QjSYbZ.png",
  footer_text: "Afiyet olsun!",
  footer_logo_url:
    "https://h1rbszj5vw7nrzh5.public.blob.vercel-storage.com/Ball%C4%B1%20Hardal-uWzwB1WU8nHj4hy7NBuUyaas8DqF2c.png",
  price_color: "#f25a07",
  accent_color: "#ea0b0b",
  primary_color: "#f25a07",
  secondary_color: "#ea0b0b",
}
