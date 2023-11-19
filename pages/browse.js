import { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import Post from '../components/browser/Post';
import { useRouter } from 'next/router';
import Image from 'next/image';
import BottomNavbar from '../components/BottomNavbar';

function BrowsePost() {
  const { posts } = useContext(GlobalContext);
  const [currentpost, setcurrentpost] = useState(0);
  const maxpost = posts.length - 1;
  const router = useRouter();
  console.log('maxpost',maxpost)

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch(event.key) {
        case 'ArrowLeft':
          console.log('try left')
          setcurrentpost(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'ArrowRight':
          console.log('try right')
          setcurrentpost(prev => (prev < maxpost ? prev + 1 : prev));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const renderBothArrows = (index,currentpost) => {
    var displaystyle = "flex";
    if (currentpost!=index){
      displaystyle = "none";
    }
    const style = {
      display: displaystyle
    }
    return (
      <div className={`arrowContainer card_${index}`} style={style}>
        <Image className="arrowKeys" src="/arrow-keys.svg" width="100" height="100" />
      </div>
    );
  }
  
  const renderLeftArrows = (index,currentpost) => {
    var displaystyle = "flex";
    if (currentpost!=index){
      displaystyle = "none";
    }
    const style = {
      display: displaystyle
    }
    return (
      <div className={`arrowContainer card_${index}`} style={style}>
        <Image className="arrowKeys" src="/arrow-keys-left.svg" width="100" height="100" />
      </div>
    );
  }
  
  const renderRightArrows = (index,currentpost) => {
    var displaystyle = "flex";
    if (currentpost!=index){
      displaystyle = "none";
    }
    const style = {
      display: displaystyle
    }
    return (
      <div className={`arrowContainer card_${index}`} style={style}>
        <Image className="arrowKeys" src="/arrow-keys-right.svg" width="100" height="100" />
      </div>
    );
  }

  const renderPosts = (currentpost) => {
    console.log(posts);
    return (
      <div className="cardsStack">
        {posts.map((post, index) => (
          <div className="cardAndArrows" key={index}>
            <Post
              title={post.title}
              addrLeft={post.addrLeft}
              addrRight={post.addrRight}
              expiry={post.expiry}
              likesLeft={post.likesLeft || []}
              likesRight={post.likesRight || []}
              name={post.authorAttrs.name}
              profilePicture={post.authorAttrs.profilePicture}
              authorAddress={post.author}
              date={post.date}
              index={index}
              totalPosts={posts.length}
              currentpost={currentpost}
            />
            {
              index==0 ? (
                index<maxpost ? renderRightArrows(index,currentpost):
                null) :
              index==posts.length-1 ? renderLeftArrows(index,currentpost):
              renderBothArrows(index,currentpost)
            }
          </div>
        ))}
      </div>
    );
  };

  const showPlaceholder = () => {
    return (
      <div className="cardsStack">
        <div className="emptyCard cardPost">
          <h2>No posts yet :(</h2>
          <Image className="emptyUp" src="/empty-up.png" width="175" height="175" />
          <h3>Be the first to create one,<br/>click the + now.</h3>
        </div>
      </div>
    );
  };
  console.log('now',currentpost)

  return (
    <div className="App">
      <div className="pageWrapper">
        {!posts.length ? showPlaceholder() : null}
        {posts.length ? renderPosts(currentpost) : null}
      </div>
      <BottomNavbar/>
    </div>
  );
  // 
  // <button className="nav-link" onClick={() => router.push('/create')}>
  //   Create New Popularity Contest
  // </button>
}

export default BrowsePost;
