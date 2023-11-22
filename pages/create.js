import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Profile from '../components/profile';
import { GlobalContext } from '../contexts/GlobalContext';
import ipfsNode from '../utils/ipfs-node';
import Loader from '../components/shared/loader';
import BottomNavbar from '../components/BottomNavbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CreatePost() {
  const [blogpost, setBlockpostValues] = useState({
    title: '',
    addrLeft: '',
    addrRight: '',
    stake: '',
    expiry: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [onIpfs, setOnIpfs] = useState(false);
  const [postOnSC, setPostOnSC] = useState(false);
  const [authorAttrs, setAuthorAttrs] = useState({name: '', profilePicture: ''});

  const router = useRouter();

  const {
    account,
    posts,
    setPosts,
    LSP7Contract,
    tokenIdCounter,
    setTokenIdCounter,
  } = useContext(GlobalContext);

  useEffect(() => {
    setExpiry();
  }, []);

  function convertDateFormats(dt){
    const [year, month, day] = dt.split("-");
    return `${day}/${month}/${year}`;
  }

  function setExpiry(){
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // January is 0
    const year = now.getFullYear();
    
    setBlockpostValues((prevValues) => {
      return { ...prevValues, ['expiry']: `${year}-${month}-${day}` };
    });
  }
  
  function changeHandler(e) {
    setError('');
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
  }

  async function createPost(e) {
    e.preventDefault();
    if (!ethereum) {
      alert('Please connect to Universal Profile Extension or MetaMask');
    }

    let ipfsResult;
    setLoading(true);

    const ipfs = ipfsNode();
    let cid;
    try {
      const postJson = JSON.stringify({
        title: blogpost.title,
        addrLeft: blogpost.addrLeft,
        addrRight: blogpost.addrRight,
        stake: blogpost.stake,
        expiry: convertDateFormats(blogpost.expiry)
      });
      ipfsResult = await ipfs.add({ content: postJson, pin: true });
      cid = ipfsResult.cid.toString();
    } catch (er) {
      console.log(er.message, 'er');
      setError('We are having trouble with ipfs. Please try again later.');
    }

    setOnIpfs(true);
    try {
      if (ipfsResult) {
        const tx = await LSP7Contract.methods
          .createPost(cid)
          .send({ from: account });

        if (tx.status) {
          console.log(authorAttrs, 'authorAttrs')
          setPosts([
            ...posts,
            {
              title: blogpost.title,
              addrLeft: blogpost.addrLeft,
              addrRight: blogpost.addrRight,
              stake: blogpost.stake,
              expiry: convertDateFormats(blogpost.expiry),
              date: new Date().toISOString(),
              author: account,
              authorAttrs,
              likesLeft: [],
              likesRight: [],
            },
          ]);
          setTokenIdCounter((s) => s + 1);
          router.push('/browse');
        }
      }
    } catch (err) {
      if (err.code == 4001) {
        console.log('User rejected transaction');
        setLoading(false);
        return;
      }
      console.log(err, 'err');
      setError('Error with transaction');
    }
    setLoading(false);
    setOnIpfs(false);
    setPostOnSC(false);
  }

  return (
    <div className="App">
      {account && (
        <>
          <div className="pageWrapper">
            <div className="cardPost createCard card_0">
              <Profile setAuthorAttrs={setAuthorAttrs}/>
              <Loader
                name="post"
                setLoading={setLoading}
                loading={loading}
                error={error}
                onIpfs={onIpfs}
                postOnSC={postOnSC}
              />
              {error ? (
                <div className="warning center">{error}</div>
              ) : (
                <div id="error" />
              )}
  
              <form
                onSubmit={function (e) {
                  createPost(e);
                }}
              >
                <label>Title</label>
                <input
                  required
                  className="titleField"
                  placeholder="What is the name of the contest?"
                  id="posttitle"
                  type="text"
                  value={blogpost.title}
                  name="title"
                  onChange={changeHandler}
                ></input>
                <label>NFT Address 1</label>
                <input
                  required
                  className="titleField"
                  placeholder="Contract address for artwork 1"
                  id="addrLeft"
                  type="text"
                  value={blogpost.addrLeft}
                  name="addrLeft"
                  onChange={changeHandler}
                ></input>
                <label>NFT Address 2</label>
                <input
                  required
                  className="titleField"
                  placeholder="Contract address for artwork 2"
                  id="addrRight"
                  type="text"
                  value={blogpost.addrRight}
                  name="addrRight"
                  onChange={changeHandler}
                ></input>
                <label>Stake amount</label>
                <input
                  required
                  className="titleField"
                  placeholder="LYXt"
                  id="stake"
                  type="text"
                  value={blogpost.stake}
                  name="stake"
                  onChange={changeHandler}
                ></input>
                <label>Pick End Date</label>
                <input
                  required
                  type="date"
                  id="expiry"
                  name="expiry"
                  value={blogpost.expiry}
                  onChange={changeHandler}
                />
                <button type="submit" className="postButton">
                  submit contest
                </button>
              </form>
              <div id="status">{blogpost.status}</div>
            </div>
          </div>
          <BottomNavbar/>
        </>
      )}
    </div>
  );
}

export default CreatePost;

