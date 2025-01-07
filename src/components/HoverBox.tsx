import '../styles/HoverBox.css';

type HoverBoxProps = {
    title: string;
    backgroundColor: string;
    content?: React.ReactNode;
    image?: string;
    contentFontSize?: string;
    isWide?: boolean;
    contentAlign?: 'center' | 'left';
};
  
export default function HoverBox({
    title,
    backgroundColor,
    content,
    image,
    contentFontSize = "1rem",
    isWide = false,
    contentAlign = 'center',
}: HoverBoxProps) {
    return (
      <div className={`hover-box ${isWide ? 'hover-box--wide' : ''}`}>
        <div className="hover-box__container">
          <div 
            className="hover-box__front"
            style={{ backgroundColor }}
          >
            <div className="hover-box__title">{title}</div>
          </div>
          <div className="hover-box__back">
            {content && (
              <div 
                className={`hover-box__content ${contentAlign === 'left' ? 'hover-box__content--left' : ''}`}
                style={{ fontSize: contentFontSize }}
              >
                {content}
              </div>
            )}
            {image && (
              <div className={`hover-box__image-container ${!content ? 'hover-box__image-container--full' : ''}`}>
                <img
                  src={image}
                  alt={title}
                  className="hover-box__image"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
}