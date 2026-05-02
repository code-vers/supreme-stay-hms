export default function Title({
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}) {
  return (
    <div className={`max-w-4xl px-2 sm:px-0 ${className}`.trim()}>
      <h1
        className={`text-(--text-brand) font-semibold leading-[1.15] mb-5 sm:mb-6 text-center text-[28px] sm:text-[42px] lg:text-[56px] mx-auto ${titleClassName}`.trim()}>
        {title}
      </h1>

      {description ? (
        <p
          className={`text-(--text-brand) text-center leading-[1.7] text-[14px] sm:text-[15px] lg:text-[16px] max-w-160 mx-auto ${descriptionClassName}`.trim()}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
