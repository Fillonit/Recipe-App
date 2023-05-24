import React from 'react'

const Footer = () => {
  return (
<footer class="bg-white rounded-lg shadow m-4">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-indigo-300 sm:text-center hover:underline">© 2023 <a href="/" class="hover:underline">Recipe App™</a>. All Rights Reserved.
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-indigo-300 sm:mt-0">
            <li>
                <a href="/about" class="mr-4 hover:underline md:mr-6 sm:mr-6 ">About</a>
            </li>
             <li>
                <a href="/" class="mr-4 hover:underline md:mr-6 sm:mr-6  ">Privacy Policy</a>
            </li>
            <li>
                <a href="/" class="mr-4 hover:underline md:mr-6 sm:mr-6 ">Licensing</a>
            </li>
            <li>
                <a href="/contact" class="hover:underline sm:mr-6 ">Contact</a>
            </li>
        </ul>
    </div>
</footer>

  )
}

export default Footer
