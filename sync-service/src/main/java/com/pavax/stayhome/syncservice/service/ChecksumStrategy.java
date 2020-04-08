package com.pavax.stayhome.syncservice.service;

public interface ChecksumStrategy {

	boolean supports(BusinessRequestDto businessRequestDto);

	String calcChecksum(BusinessRequestDto businessRequestDto);

}
