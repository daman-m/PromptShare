'use client'

import { useEffect, useState } from 'react'
import PromptCard from './PromptCard'
import { SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'



const PromptCardList = ({ data, handleTagClick}) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
        key={post._id}
        post={post}
        handleTagClick={handleTagClick}
        />
      ))}

    </div>
  )
  
}

const Feed = () => {
  const [searchText, setSearchText] = useState('')
  const [posts, setPosts] = useState([])

  const handleSearchChange = (e) => {
    e.preventDefault(); 
    setSearchText(e.target.value);
  };
  
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('api/prompt');
      const data = await res.json()

      setPosts(data);
    }
    console.log(posts);

    fetchPosts();
  }, [])


    return (
    <section className='feed'>
      <form className="relative w-full flex-center">
        <input type="text" placeholder='Search for a tag or a username'
        value={searchText}
        onChange={handleSearchChange}
        required  
        className='search_input peer'
         />
      </form>

      <PromptCardList
      data={posts}
      handleTagClick={()=>{}} 
      />
    </section>
  )
}

export default Feed