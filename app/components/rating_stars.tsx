import {
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
} from 'react-icons/fa'


interface RatingStarsProps {
    variant: 'normal' | 'medium' | 'tiny',
    rating: number,
}


export default function RatingStars({ variant, rating }: RatingStarsProps) {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5 ? 1 : 0
    const emptyStars = 5 - fullStars - halfStar

    return (
        <div className={`flex text-primary ${variant == 'normal' ? '' : 'text-tiny'}`}>
            {Array(fullStars)
                .fill(0)
                .map((_, i) => (
                    <FaStar key={`full-${i}`} />
                ))}
            {halfStar === 1 && <FaStarHalfAlt />}
            {Array(emptyStars)
                .fill(0)
                .map((_, i) => (
                    <FaRegStar key={`empty-${i}`} />
                ))}
        </div>
    )
}

