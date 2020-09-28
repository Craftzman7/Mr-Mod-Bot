#############
## Imports ##
#############
import discord
from discord import Embed, Member
from discord.ext import commands
import random
import datetime
from discord.ext.commands import Bot
import aiohttp
import pydealer
import json
config = ("./config.json")
########################################################
####      Mod Bot by CrafterZMan and LlamaBoiq      ####
########################################################




client = commands.Bot(command_prefix = 'l')

@client.event
async def on_ready():
    print('Bot Coded and Managed by LlamaBoiq and CrafterZMan • All Rights Reserved')
    print("Bot is Online")

##############
##Calculator##
##############


#########
## Add ##
#########
@client.command(aliases = ['plus', 'addition'])
async def add(ctx, a:float, b:float):
    embed = discord.Embed(colour = discord.Colour.green(), title=f'{a+b}')
    embed.set_author(name=f"{a} + {b} = {a + b}")
    embed.set_footer(text=f'Requested By • {ctx.author}')
    await ctx.send(embed=embed)
######################
##Add error handling##
######################
@add.error
async def adderror_error(ctx,error):
    if isinstance(error, commands.MissingRequiredArgument):
        embed = discord.Embed(colour= discord.Colour.red(), title='<0add> (NUMBER1), (NUMBER2)')
        embed.set_author(name='Incorrect Usage')
        embed.set_footer(text='Bot coded and managed by LlamaBoiq and CrafterZMan • All Rights Reserved')
        await ctx.send(embed=embed)
#############
##Substract##
#############
@client.command(aliases = ['sub', 'minus'])
async def subtract(ctx, a:float, b:float):
    embed = discord.Embed(colour = discord.Colour.green(), title=f'{a-b}')
    embed.set_author(name=f"{a} - {b} = {a-b}")
    embed.set_footer(text=f'Requested By • {ctx.author}')
    await ctx.send(embed=embed)

#############################
##subsctract Error Handling##
#############################
@subtract.error
async def suberror_error(ctx,error):
    if isinstance(error, commands.MissingRequiredArgument):
        embed = discord.Embed(colour= discord.Colour.red(), title='<0subtract> (NUMBER1), (NUMBER2)')
        embed.set_author(name='Incorrect Usage')
        embed.set_footer(text='Bot coded and managed by LlamaBoiq and CrafterZMan • All Rights Reserved')
        await ctx.send(embed=embed)

############
##Multiply##
############
@client.command(aliases = ['mul', 'times'])
async def multiply(ctx, a:float, b:float):
    embed = discord.Embed(colour = discord.Colour.green(), title=f'{a*b}')
    embed.set_author(name=f"{a} * {b} = {a*b}")
    embed.set_footer(text=f'Requested By • {ctx.author}')
    await ctx.send(embed=embed)

##################
##Multiply Error##
##################
@multiply.error
async def mulerror_error(ctx,error):
    if isinstance(error, commands.MissingRequiredArgument):
        embed = discord.Embed(colour= discord.Colour.red(), title='<0multiply> (NUMBER1), (NUMBER2)')
        embed.set_author(name='Incorrect Usage')
        embed.set_footer(text='Bot coded and managed by LlamaBoiq and CrafterZMan • All Rights Reserved')
        await ctx.send(embed=embed)

##########
##Divide##
##########
@client.command(aliases = ['div', 'division'])
async def divide(ctx, a:float, b:float):
    embed = discord.Embed(colour = discord.Colour.green(), title=f'{a/b}')
    embed.set_author(name=f"{a} / {b} = {a/b}")
    embed.set_footer(text=f'Requested By • {ctx.author}')
    await ctx.send(embed=embed)

################
##divide error##
################
@divide.error
async def divrror_error(ctx,error):
    if isinstance(error, commands.MissingRequiredArgument):
        embed = discord.Embed(colour= discord.Colour.red(), title='<0divide> (NUMBER1), (NUMBER2)')
        embed.set_author(name='Incorrect Usage')
        embed.set_footer(text='Bot coded and managed by LlamaBoiq and CrafterZMan • All Rights Reserved')
        await ctx.send(embed=embed)

##########
## Meme ##
##########

@client.command(pass_context=True, aliases = ['m'])
async def meme(ctx):
    embed = discord.Embed(colour = discord.Colour.purple())

    async with aiohttp.ClientSession() as cs:
        async with cs.get('https://www.reddit.com/r/memes/new.json?sort=hot') as r:
            res = await r.json()
            embed.set_image(url=res['data']['children'] [random.randint(0, 25)]['data']['url'])
            await ctx.send(embed=embed)

@meme.error
async def meme_error(ctx,error):
    if isinstance(error, commands.CommandInvokeError):
        embed = discord.Embed(colour= discord.Colour.red(), title='Please try again')
        embed.set_author(name='Error fetching a meme')
        embed.set_footer(text='Bot coded and managed by LlamaBoiq and CrafterZMan • All Rights Reserved')
        await ctx.send(embed=embed)

############
## Avatar ##
############

@client.command(aliases = ['a'])
async def useravatar(ctx, *, member: discord.Member=None):
    if not member: # if member is no mentioned
        member = ctx.message.author # set member as the author
    userAvatar = member.avatar_url
    await ctx.send(userAvatar)

client.run(config.token)