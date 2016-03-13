package com.wutadove.wjsonconv;

import java.util.ArrayList;

public class WaveformData {
	private String id;
	private long sample_rate;
	private int samples_per_pixel;
	public long getSample_rate() {
		return sample_rate;
	}

	public void setSample_rate(long sample_rate) {
		this.sample_rate = sample_rate;
	}

	public int getSamples_per_pixel() {
		return samples_per_pixel;
	}

	public void setSamples_per_pixel(int samples_per_pixel) {
		this.samples_per_pixel = samples_per_pixel;
	}

	public int getNumber_of_channel() {
		return number_of_channel;
	}

	public void setNumber_of_channel(int number_of_channel) {
		this.number_of_channel = number_of_channel;
	}

	public long getDuration() {
		return duration;
	}

	public void setDuration(long duration) {
		this.duration = duration;
	}

	public ArrayList<Integer> getMin() {
		return min;
	}

	public void setMin(ArrayList<Integer> min) {
		this.min = min;
	}

	public ArrayList<Integer> getMax() {
		return max;
	}

	public void setMax(ArrayList<Integer> max) {
		this.max = max;
	}

	private int number_of_channel;
	private long duration;
	private ArrayList<Integer> min;
	private ArrayList<Integer> max;
	
	public WaveformData(long sr, int spp, int noc, long d , ArrayList<Integer> min, ArrayList<Integer> max){
		sample_rate = sr;
		samples_per_pixel = spp;
		number_of_channel = noc;
		duration = d;
		this.min = min;
		this.max = max;
		
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}
