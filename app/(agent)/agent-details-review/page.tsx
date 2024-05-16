"use client";
import {
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { StarIcon, HandThumbUpIcon as HandThumbUpIconSolid } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { AllComments } from "../../../data/data";
import { useEffect, useState } from "react";

type comment = {
  name: string;
  date: string;
  nbstars: number;
  content: string;
  likes: number;
  unlikes: number;
};

type LikeState = {
  [key: number]: {isLiked: boolean, isUnliked: boolean};
};

function StarRating(rating: number) {
  const stars = [];

  // Fill the stars array based on the rating
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(
        <StarIcon key={i} className="w-5 h-5 text-[var(--tertiary)]" />
      );
    } else {
      stars.push(<StarIcon key={i} className="w-5 h-5 text-[#AAAAAA]" />);
    }
  }

  return (
    <>
      {/* Render the stars from the array */}
      {stars}
    </>
  );
}

function calculateAverageRating(list: comment[]): string {
  if (list.length === 0) {
    return "0.0";
  }

  const totalStars = list.reduce((acc, comment) => acc + comment.nbstars, 0);

  const averageRating = (totalStars / list.length).toFixed(1);

  return averageRating;
}

function calculateRatingPercent(rating: number) {
  const ratingList = AllComments.filter(
    (comment) => comment.nbstars === rating
  );
  return ((ratingList.length / AllComments.length) * 100).toFixed(0);
}

const filterByRating = (rating: number) => {
  console.log(rating);
  const result = AllComments.filter((comment) => comment.nbstars == rating);
  console.log("hey");

  return result;
};

const sortByLikes = () => {
  const sortedComments = [...AllComments];
  sortedComments.sort((comment1, comment2) => comment2.likes - comment1.likes);
  return sortedComments;
};

const extractDateFromISO8601 = (isoDate: string) => {
  const dateParts = isoDate.split("T");
  return dateParts[0];
};
const extractTimeFromISO8601 = (isoDate: string) => {
  const dateParts = isoDate.split("T");
  return dateParts[1].split(".")[0];
};

const sortByDate = () => {
  const sortedComments = [...AllComments];
  sortedComments.sort((comment1, comment2) => {
    const date1 = new Date(comment1.date);
    const date2 = new Date(comment2.date);
    return date2.getTime() - date1.getTime();
  });
  return sortedComments;
};
const Page = () => {
  const [comments, setComments] = useState(AllComments);
  const [openReviews, setOpenReviews] = useState(false);
  const [filterType, setFilterType] = useState("none"); 
  const [likeState, setLikeState] = useState<LikeState>({});

  useEffect(() => {
    // Récupérer les données de like depuis le localStorage
    const storedLikes = localStorage.getItem("likes");
    const storedUnlikes = localStorage.getItem("unlikes");
    if (storedLikes) {
      setLikeState(JSON.parse(storedLikes));
    }
    if (storedUnlikes) {
      setLikeState(JSON.parse(storedUnlikes));
    }
  }, []);

  const handleLike = (index: number) => {
    const currentState = likeState[index] || {isLiked: false,isUnliked: false};
    const updatedState = {isLiked: !currentState.isLiked, isUnliked: currentState.isUnliked ? false:false};
    const updatedLikeState = { ...likeState, [index]: updatedState };
    setLikeState(updatedLikeState);
    localStorage.setItem("likes", JSON.stringify(updatedLikeState));

    // Mettre à jour le nombre de likes
    const updatedComments = [...comments];
    updatedComments[index].likes += updatedState.isLiked ? 1 : -1;
    updatedComments[index].unlikes += currentState.isUnliked ? -1 : 0;
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const handleUnlike = (index: number) => {
    const currentState = likeState[index] || {isLiked: false,isUnliked: false};
    const updatedState = {isLiked: currentState.isUnliked ? false:false, isUnliked: !currentState.isUnliked};
    const updatedLikeState = { ...likeState, [index]: updatedState };
    setLikeState(updatedLikeState);
    localStorage.setItem("likes", JSON.stringify(updatedLikeState));

    // Mettre à jour le nombre de likes
    const updatedComments = [...comments];
    updatedComments[index].likes += currentState.isLiked ? -1 : 0;
    updatedComments[index].unlikes += updatedState.isUnliked ? 1 : -1;
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const handleFilterType = (e:React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterType(value);
    switch (value) {
      case "none":
        break;
      case "latest":
        setComments(sortByDate());
        break;
      case "interest":
        setComments(sortByLikes());
        break;
      default:
        setComments(filterByRating(parseInt(e.target.value)));
    }
  };
  return (
    <div className="col-span-12">
      <div className="p-3 sm:p-4 lg:p-6 xl:p-8 bg-white rounded-2xl mb-8">
        <div className="flex items-center gap-2">
          <StarIcon className="w-7 h-7 text-[var(--tertiary)]" />
          <h4 className="mb-0 text-3xl font-bold flex-grow">
            {" "}
            {calculateAverageRating(AllComments)}{" "}
          </h4>
          <h4 className="mb-0 text-2xl font-semibold flex-grow">
            {" "}
            Average Reviews{" "}
          </h4>
        </div>
        <div className="border border-dashed my-8"></div>
        <ul className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="flex items-center shrink-0">
                <span className="inline-block"> {rating} </span>
                <i className="lar la-star"></i>
              </div>
              <div className="w-full bg-[#E9ECEF] rounded-3xl h-3 flex-grow">
                <div
                  className={`rounded-3xl bg-[#FFC107] h-full`}
                  style={{ width: `${calculateRatingPercent(rating)}%` }}
                ></div>
              </div>
              <span className="inline-block font-medium shrink-0">
                {calculateRatingPercent(rating)}%
              </span>
            </li>
          ))}
        </ul>
        <div className="border border-dashed my-8"></div>

        <div className="bg-white rounded-2xl sm:p-4 lg:py-8 lg:px-5">
          <div className="flex items-center gap-4 justify-between flex-wrap mb-10">
            <div className="flex items-center gap-2">
              <h3 className="mb-0 h3"> {comments.length} reviews </h3>
            </div>
            <div className="flex items-center gap-2">
              <p className="mb-0 clr-neutral-500 shrink-0"> Sort By : </p>
              <div className="border rounded-full pr-3">
                <select
                  className="w-full bg-transparent px-5 py-3 focus:outline-none"
                  onChange={handleFilterType}
                >
                  <option value="none">none</option>
                  <option value="latest">Latest</option>
                  <option value="interest">Most interesting</option>
                  <option value="1">1⭐</option>
                  <option value="2">2⭐</option>
                  <option value="3">3⭐</option>
                  <option value="4">4⭐</option>
                  <option value="5">5⭐</option>
                </select>
              </div>
            </div>
          </div>
          {comments.map((comment, index) => {
            return index > 1 && !openReviews ? (
              ""
            ) : (
              <div
                key={index}
                className="bg-[var(--bg-1)] rounded-2xl p-3 sm:p-4 lg:p-6 mb-8"
              >
                <div className="flex items-center flex-wrap justify-between gap-4">
                  <div className="flex gap-5 items-center">
                    <div className="w-15 h-15 shrink-0 rounded-full overflow-hidden">
                      <Image
                        width={60}
                        height={60}
                        src="/img/user-4.jpg"
                        alt="image"
                        className=" w-full h-full object-fit-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h5 className="mb-1 font-semibold"> {comment.name} </h5>
                    </div>
                  </div>
                  <div className="text-sm-end">
                    <p className="mb-1">
                      {" "}
                      {extractTimeFromISO8601(comment.date)}{" "}
                    </p>
                    <p className="mb-0">
                      {" "}
                      {extractDateFromISO8601(comment.date)}{" "}
                    </p>
                  </div>
                </div>
                <div className="border border-dashed my-6"></div>
                <div className="flex gap-1 mb-3">
                  {StarRating(comment.nbstars)}
                </div>
                <p className="mb-0 clr-neutral-500">{comment.content}</p>
                <div className="border border-dashed my-6"></div>
                  <div className="flex flex-wrap items-center gap-10">
                    <div className={`flex items-center gap-2 text-primary cursor-pointer ${likeState[index]?.isLiked ? "text-blue-500" : ""}`}
                    onClick={() => handleLike(index)}
                    >
                      {likeState[index]?.isLiked ? (
                        <HandThumbUpIconSolid className="w-5 h-5" />
                      ) : (
                        <HandThumbUpIcon className="w-5 h-5" />
                      )}
                      <span className="inline-block"> {comment.likes} </span>
                    </div>

                    <div className={`flex items-center gap-2 text-primary cursor-pointer ${likeState[index]?.isUnliked ? "text-red-500" : ""}`}
                    onClick={() => handleUnlike(index)}
                    >
                      {likeState[index]?.isUnliked ? (
                        <HandThumbUpIconSolid className="w-5 h-5 rotate-180" />
                      ) : (
                        <HandThumbUpIcon className="w-5 h-5 rotate-180" />
                      )}
                      <span className="inline-block"> {comment.unlikes} </span>
                    </div>

                    {/*<div className="flex items-center gap-2 text-primary">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      <span className="inline-block"> Reply </span>
                    </div>*/}
                  </div>
                </div>
              );
            })}

          <button
            onClick={() => setOpenReviews(!openReviews)}
            className="featured-tab link font-semibold clr-primary-400 inline-block py-3 px-6 bg-[var(--primary-light)] hover:bg-primary hover:text-white rounded-full active"
          >
            {openReviews ? "Hide" : "See All Reviews"}
          </button>
        </div>
      </div>
      {/* Formulaire d'écriture de commentaire */}
      <div className="section-space--sm">
        <div className="bg-white rounded-2xl p-3 sm:p-4 lg:py-8 lg:px-5">
          <h4 className="mb-0 text-2xl font-semibold">Write a review</h4>
          <div className="border border-dashed my-6"></div>
          <p className="text-xl font-medium mb-3">Rating *</p>
          <div className="flex gap-1 mb-3">
            <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
            <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
            <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
            <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
            <StarIcon className="w-5 h-5 text-[var(--tertiary)]" />
          </div>
          <form action="#">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <label
                  htmlFor="review-name"
                  className="text-xl font-medium block mb-3">
                  Name *
                </label>
                <input
                  type="text"
                  className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5 focus:outline-none"
                  placeholder="Enter Name.."
                  id="review-name"
                />
              </div>
              <div className="col-span-12">
                <label
                  htmlFor="review-email"
                  className="text-xl font-medium block mb-3">
                  Email *
                </label>
                <input
                  type="text"
                  className="w-full bg-[var(--bg-1)] border border-neutral-40 rounded-full py-3 px-5 focus:outline-none"
                  placeholder="Enter Email.."
                  id="review-email"
                />
              </div>
              <div className="col-span-12">
                <label
                  htmlFor="review-review"
                  className="text-xl font-medium block mb-3">
                  Review *
                </label>
                <textarea
                  id="review-review"
                  rows={5}
                  className="bg-[var(--bg-1)] border rounded-2xl py-3 px-5 w-full focus:outline-none"></textarea>
              </div>
              <div className="col-span-12">
                <Link href="#" className="btn-primary">
                  Submit Review
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
