import { useRouter } from 'next/router';
import identicon from 'ethereum-blockies-base64';
import { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { GlobalContext } from '../../contexts/GlobalContext';

const Post = ({ title, addrLeft, addrRight, expiry, likesLeft, likesRight, name, profilePicture, authorAddress, date, index, currentpost, totalPosts }) => {
    
  const {
    account,
  } = useContext(GlobalContext);
  
  console.log(account)
  
  const router = useRouter();
  const identiconPicture = '';
  const accounts = '';
  // On mount
  useEffect(() => {
    loadVotes();
    loadIdenticonPicture();
    formatText();
    formatDate();
  }, []);

  const [blogpost, setBlockpostValues] = useState({
    title: '',
    addrLeft: '',
    addrRight: '',
    expiry: '',
    author: '',
    identicon: '',
    name: 'anonymous',
    date: '',
    profilePicture: '',
    likesLeft: [],
    likesRight: [],
  });

  const [hasVoted, setHasVoted] = useState({voted:'neither'});

  const handleBlogpostValues = (name, value) => {
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };
  
  const loadVotes = () => {
    // right vote takes precedence if there is duplication
    let tempLeftLikes = [];
    for (var a of likesLeft) if (!likesRight.includes(a)) tempLeftLikes.push(a);
    
    handleBlogpostValues('likesLeft',tempLeftLikes);
    handleBlogpostValues('likesRight',likesRight);

    for (var a of likesLeft){
      if (a == account) setHasVoted({voted:'left'});
    }
    for (var a of likesRight){
      if (a == account) setHasVoted({voted:'right'});
    }
  }

  const loadAddresses = () => {
    handleBlogpostValues('addrLeft',addrLeft);
    handleBlogpostValues('addrRight',addrRight);
  }

  const formatDate = () => {
    var today = new Date(date);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy;
    handleBlogpostValues('date', today);
    
    console.log('expiry',expiry)
    handleBlogpostValues('expiry', expiry);
  }

  const formatText = () => {
      // Trimm title if it has too many characters
    if (title.length > 32) {
      handleBlogpostValues('title', title.substring(0, 32) + '...');
    } else {
      handleBlogpostValues('title', title);
    }

    // // Trimm text if it has too many characters
    // if (text.length > 100) {
    //   handleBlogpostValues('text', text.substring(0, 100) + '...');
    // } else {
    //   handleBlogpostValues('text', text);
    // }
  }

  async function loadIdenticonPicture() {

    const blockie = identicon(authorAddress);

    // generate identicon
    handleBlogpostValues('identicon', blockie);
  }
  
  function voteLeft(){
    if (hasVoted.voted == 'left'){
      setHasVoted({voted:'neither'});
      setBlockpostValues((prevValues) => {
        return { ...prevValues, likesLeft: prevValues['likesLeft'].filter(a => account!=a) };
      });
    }
    else if (hasVoted.voted == 'right'){
      setHasVoted({voted:'left'});
      setBlockpostValues((prevValues) => {
        return { 
          ...prevValues, 
          likesLeft: [...prevValues['likesLeft'],account],
          likesRight: prevValues['likesRight'].filter(a => account!=a)
        };
      });
    }
    else if (hasVoted.voted == 'neither'){
      setHasVoted({voted:'left'});
      setBlockpostValues((prevValues) => {
        return { 
          ...prevValues, 
          likesLeft: [...prevValues['likesLeft'],account],
        };
      });
    }
  }
  
  function voteRight(){
    if (hasVoted.voted == 'right'){
      setHasVoted({voted:'neither'});
      setBlockpostValues((prevValues) => {
        return { ...prevValues, likesRight: prevValues['likesRight'].filter(a => account!=a) };
      });
    }
    else if (hasVoted.voted == 'left'){
      setHasVoted({voted:'right'});
      setBlockpostValues((prevValues) => {
        return { 
          ...prevValues, 
          likesRight: [...prevValues['likesRight'],account],
          likesLeft: prevValues['likesLeft'].filter(a => account!=a)
        };
      });
    }
    else if (hasVoted.voted == 'neither'){
      setHasVoted({voted:'right'});
      setBlockpostValues((prevValues) => {
        return { 
          ...prevValues, 
          likesRight: [...prevValues['likesRight'],account],
        };
      });
    }
  }
  
  const img1 = "/cryptopunk"+(2*index%3+1)+".jpg";
  const img2 = "/cryptopunk"+(2*index%3+2)+".jpg";

  var displaystyle = "flex";
  if (currentpost!=index){
    displaystyle = "none";
  }
  const style = {
    display: displaystyle
  }
  return (
    <div className={`post cardPost card_${index}`} key={index} style={style}>
      <div className="postAbove">
        <div className="postprofile">
          <div className="profileImage">
            <div
              className="identicon"
              style={{
                backgroundImage: 'url(' + blogpost.identicon + ')',
              }}
              id="identicon"
            ></div>
            {
              profilePicture ?
              (
                <div
                  className="image"
                  id="image"
                  style={{
                    backgroundImage: 'url(' + profilePicture + ')',
                  }}
                ></div>
              ):
              (
              <div
                className="image" d
                id="image"
              ></div>
              )
            }

          </div>
          <div className="postNameAddress">
            <div className="postName">
              {
                name? (
                  <a
                    href={`https://l16.universalprofile.cloud/${authorAddress}`}
                    target='_blank'
                    rel="noreferrer"
                  >
                    @{name}
                  </a>
                ):
                  '@anonymous'
              }
            </div>
            <div className="postAddress">
              {authorAddress}
            </div>
          </div>
        </div>
      </div>
      <div className="postBelow">
        <div className="postTitleRow">
          <h2> {blogpost.title}</h2>
          <p className="specialtxt textDate">{blogpost.date}</p>
        </div>
        <div className="viewOnChainRow">
          <a href={"https://explorer.execution.testnet.lukso.network/address/"+addrLeft} target="_blank">view on chain</a>
          <a href={"https://explorer.execution.testnet.lukso.network/address/"+addrRight} target="_blank">view on chain</a>
        </div>
        <div className="nftImgs">
          {
          hasVoted.voted == 'left' ? (<>
            <Image className="nftLeft votedfor" src={img1} width="500px" height="500px" onClick={voteLeft}/>
            <Image className="nftRight notvotedfor" src={img2} width="500px" height="500px" onClick={voteRight}/>
          </>) : hasVoted.voted == 'right' ? (<>
            <Image className="nftLeft notvotedfor" src={img1} width="500px" height="500px" onClick={voteLeft}/>
            <Image className="nftRight votedfor" src={img2} width="500px" height="500px" onClick={voteRight}/>
          </>) : hasVoted.voted == 'neither' ? (<>
            <Image className="nftLeft" src={img1} width="500px" height="500px" onClick={voteLeft}/>
            <Image className="nftRight" src={img2} width="500px" height="500px" onClick={voteRight}/>
          </>) : <></>
        }
        </div>
        <div className="likesRow">
          {
            hasVoted.voted == 'left' ? (<>
              <div className="postNumStatsContainer likesLeft liked" onClick={voteLeft}>
                <Image src="/heart-red.svg" width="30" height="30" />
                <p className="postNumStats numLikesLeft">{blogpost.likesLeft.length}</p>
              </div>
              <div className="postNumStatsContainer likesRight" onClick={voteRight}>
                <Image src="/heart-dark.svg" width="30" height="30" />
                <p className="postNumStats numLikesRight">{blogpost.likesRight.length}</p>
              </div>
            </>) : hasVoted.voted == 'right' ? (<>
              <div className="postNumStatsContainer likesLeft" onClick={voteLeft}>
                <Image src="/heart-dark.svg" width="30" height="30" />
                <p className="postNumStats numLikesLeft">{blogpost.likesLeft.length}</p>
              </div>
              <div className="postNumStatsContainer likesRight liked" onClick={voteRight}>
                <Image src="/heart-red.svg" width="30" height="30" />
                <p className="postNumStats numLikesRight">{blogpost.likesRight.length}</p>
              </div>
            </>) : hasVoted.voted == 'neither' ? (<>
              <div className="postNumStatsContainer likesLeft" onClick={voteLeft}>
                <Image src="/heart-dark.svg" width="30" height="30" />
                <p className="postNumStats numLikesLeft">{blogpost.likesLeft.length}</p>
              </div>
              <div className="postNumStatsContainer likesRight" onClick={voteRight}>
                <Image src="/heart-dark.svg" width="30" height="30" />
                <p className="postNumStats numLikesRight">{blogpost.likesRight.length}</p>
              </div>
            </>) : <></>
          }
        </div>
      </div>
      <p className="postExpiry"><span className="lessimportant">Contest expires on the</span> {blogpost.expiry}</p>
      <p className="specialtxt postNum">{index+1} / {totalPosts}</p>
    </div>
  );
};

export default Post;
